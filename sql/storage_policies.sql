-- Allow public access to view avatars
create policy "Avatars are publicly accessible"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatar
create policy "Users can upload avatars"
on storage.objects for insert
with check (
    bucket_id = 'avatars' 
    and auth.role() = 'authenticated'
);

-- Allow users to update their own avatars
create policy "Users can update own avatar"
on storage.objects for update
using (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatars
create policy "Users can delete own avatar"
on storage.objects for delete
using (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
);