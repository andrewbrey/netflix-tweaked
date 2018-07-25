# Packaging for Edge


[Microsoft instructions...](https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/using-manifoldjs-to-package-extensions)

##### HEY! Do everything from the root directory. Running manifold from inside the NetflixTweaked directory will cause infinite recursion

1. Run `gulp package` to build Chrome and Firefox first. Firefox builds second, so the `dist` folder will contain the FF 
   exploded package - The Edge package is basically the FF package plus some Edge "API bridge" (Microsoft's term) files.
2. Run the `Microsoft Edge Extension Toolkit` against the `dist` directory to insert the API bridges and update 
   the manifest - Note that this makes edits in place rather than safely on file duplicates
3. Run `npm run edge:manifold-prep` to use manifold to stub out the exploded Edge package
4. In the newly created Edge package in the `NetflixTweaked` directory, edit the `appxmanifest.xml` to have the following:
    * `Package/Identity/Name` comes from the `App management > App identity` page
    * `Package/Identity/Publisher` comes from the `App management > App identity` page
    * `Package/Identity/Version` comes from the `manifest.json` however, Edge uses a 4 point version scheme, so bump everything
      forward by 1 number, ensuring a `0` is in the final ("revision") number
    * `Package/Properties/PublisherDisplayName` comes from the `App management > App identity` page
    * `Package/Properties/DisplayName` is `Netflix Tweaked - Aesthetic Tweaks for Desktop Netflix`
5. Copy the following files from `app/images/` into the Edge package `Assets` directory:
    * `Square44x44Logo.png`
    * `Square54x54Logo.png`
    * `Square150x150Logo.png`
    * `StoreLogo.png`
6. Run `npm run edge:manifold-package` to use manifold to build the final package which spits out to `NetflixTweaked/edgeextension/package`