from http import HTTPStatus
from typing import Annotated, Callable
import jwt
from fastapi import Depends, HTTPException, WebSocket, WebSocketException, status
from fastapi.requests import HTTPConnection
from pydantic import BaseModel
from starlette.requests import Request


class AuthConfig(BaseModel):
    supabase_url: str
    supabase_key: str
    header: str = "authorization"


class User(BaseModel):
    # The subject, or user ID, from the authenticated token
    sub: str

    # Optional extra user data
    user_id: str | None = None
    name: str | None = None
    picture: str | None = None
    email: str | None = None


def get_auth_config(request: HTTPConnection) -> AuthConfig:
    auth_config: AuthConfig | None = request.app.state.auth_config

    if auth_config is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED, detail="No auth config"
        )
    return auth_config


AuthConfigDep = Annotated[AuthConfig, Depends(get_auth_config)]


def get_audit_log(request: HTTPConnection) -> Callable[[str], None] | None:
    return getattr(request.app.state.databutton_app_state, "audit_log", None)


AuditLogDep = Annotated[Callable[[str], None] | None, Depends(get_audit_log)]


def get_authorized_user(
    request: HTTPConnection,
) -> User:
    auth_config = get_auth_config(request)

    try:
        if isinstance(request, WebSocket):
            user = authorize_websocket(request, auth_config)
        elif isinstance(request, Request):
            user = authorize_request(request, auth_config)
        else:
            raise ValueError("Unexpected request type")

        if user is not None:
            return user
        print("Request authentication returned no user")
    except Exception as e:
        print(f"Request authentication failed: {e}")

    if isinstance(request, WebSocket):
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION, reason="Not authenticated"
        )
    else:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED, detail="Not authenticated"
        )


# Supabase JWT public key
# This is a constant for all Supabase projects
SUPABASE_JWT_SECRET = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnzyis1ZjfNB0bBgKFMSv\nvkTtwlvBsaJq7S5wA+kzeVOVpVWwkWdVha4s38XM/pa/yr47av7+z3VTmvDRyAHc\naT92whREFpLv9cj5lTeJSibyr/Mrm/YtjCZVWgaOYIhwrXwKLqPr/11inWsAkfIy\ntvHWTxZYEcXLgAXFuUuaS3uF9gEiNQwzGTU1v0FqkqTBr4B8nW3HCN47XUu0t8Y0\ne+lf4s4OxQawWD79J9/5d3Ry0vbV3Am1FtGJiJvOwRsIfVChDpYStTcHTCMqtvWb\nV6L11BWkpzGXSW4Hv43qa+GSYOD2QU68Mb59oSk2OB+BtOLpJofmbGEGgvmwyCI9\nMwIDAQAB\n-----END PUBLIC KEY-----"


def authorize_websocket(
    request: WebSocket,
    auth_config: AuthConfig,
) -> User | None:
    # Parse Sec-Websocket-Protocol
    header = "Sec-Websocket-Protocol"
    sep = ","
    prefix = "Authorization.Bearer."
    protocols_header = request.headers.get(header)
    protocols = (
        [h.strip() for h in protocols_header.split(sep)] if protocols_header else []
    )

    token: str | None = None
    for p in protocols:
        if p.startswith(prefix):
            token = p.removeprefix(prefix)
            break

    if not token:
        print(f"Missing bearer {prefix}.<token> in protocols")
        return None

    return authorize_token(token, auth_config)


def authorize_request(
    request: Request,
    auth_config: AuthConfig,
) -> User | None:
    auth_header = request.headers.get(auth_config.header)
    if not auth_header:
        print(f"Missing header '{auth_config.header}'")
        return None

    token = auth_header.startswith("Bearer ") and auth_header[7:]
    if not token:
        print(f"Missing bearer token in '{auth_config.header}'")
        return None

    return authorize_token(token, auth_config)


def authorize_token(
    token: str,
    _auth_config: AuthConfig,  # Not used but kept for interface compatibility
) -> User | None:
    try:
        # Decode the Supabase JWT token
        # Supabase tokens are signed with RS256 algorithm
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["RS256"],
            options={"verify_aud": False},  # Supabase doesn't use audience claim
        )

        # Extract user information from the token
        # Supabase tokens have the user ID in the 'sub' claim
        sub = payload.get("sub")
        if not sub:
            print("Token missing 'sub' claim")
            return None

        # Extract additional user information from Supabase token
        # Supabase stores user info in the 'user_metadata' or directly in the token
        email = None
        name = None

        # Try to get email from standard claim
        if "email" in payload:
            email = payload.get("email")
        # Try to get email from user_metadata
        elif "user_metadata" in payload and isinstance(payload["user_metadata"], dict):
            email = payload["user_metadata"].get("email")

        # Try to get name from user_metadata
        if "user_metadata" in payload and isinstance(payload["user_metadata"], dict):
            name = payload["user_metadata"].get("full_name") or payload["user_metadata"].get("name")

        # Create and return the user
        user = User(
            sub=sub,
            user_id=sub,  # Use sub as user_id
            email=email,
            name=name,
        )
        print(f"User {user.sub} authenticated via Supabase")
        return user

    except jwt.PyJWTError as e:
        print(f"Failed to decode and validate Supabase token: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error validating token: {e}")
        return None
