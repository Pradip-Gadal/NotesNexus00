import os
import pathlib
import json
import dotenv
from fastapi import FastAPI, APIRouter, Depends

dotenv.load_dotenv()

from databutton_app.mw.auth_mw import AuthConfig, get_authorized_user


def get_router_config() -> dict:
    try:
        # Note: This file is not available to the agent
        cfg = json.loads(open("routers.json").read())
    except:
        return False
    return cfg


def is_auth_disabled(router_config: dict, name: str) -> bool:
    return router_config["routers"][name]["disableAuth"]


def import_api_routers() -> APIRouter:
    """Create top level router including all user defined endpoints."""
    routes = APIRouter(prefix="/routes")

    router_config = get_router_config()

    src_path = pathlib.Path(__file__).parent

    # Import API routers from "src/app/apis/*/__init__.py"
    apis_path = src_path / "app" / "apis"

    api_names = [
        p.relative_to(apis_path).parent.as_posix()
        for p in apis_path.glob("*/__init__.py")
    ]

    api_module_prefix = "app.apis."

    for name in api_names:
        print(f"Importing API: {name}")
        try:
            api_module = __import__(api_module_prefix + name, fromlist=[name])
            api_router = getattr(api_module, "router", None)
            if isinstance(api_router, APIRouter):
                routes.include_router(
                    api_router,
                    dependencies=(
                        []
                        if is_auth_disabled(router_config, name)
                        else [Depends(get_authorized_user)]
                    ),
                )
        except Exception as e:
            print(e)
            continue

    print(routes.routes)

    return routes


def get_supabase_config() -> dict | None:
    # Get Supabase URL and key from environment variables
    # These should be set in your .env file
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")

    if supabase_url and supabase_key:
        return {
            "supabase_url": supabase_url,
            "supabase_key": supabase_key,
        }

    # Fallback to hardcoded values from frontend/src/utils/supabaseClient.ts
    # In production, you should use environment variables
    return {
        "supabase_url": "https://mfiohghefivdtspfjlgk.supabase.co",
        "supabase_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1maW9oZ2hlZml2ZHRzcGZqbGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjQ4NDQsImV4cCI6MjA2MDgwMDg0NH0.iRgBh6umEJZB4WL_VrbmhzErF8HzepP-BWwjnt_yUtM",
    }


def create_app() -> FastAPI:
    """Create the app. This is called by uvicorn with the factory option to construct the app object."""
    app = FastAPI()
    app.include_router(import_api_routers())

    for route in app.routes:
        if hasattr(route, "methods"):
            for method in route.methods:
                print(f"{method} {route.path}")

    supabase_config = get_supabase_config()

    if supabase_config is None:
        print("No Supabase config found")
        app.state.auth_config = None
    else:
        print("Supabase config found")
        app.state.auth_config = AuthConfig(**supabase_config)

    return app


app = create_app()
