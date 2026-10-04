import { useEffect } from 'react';

// Opens the "new profile" dialog from anywhere (empty states, onboarding, settings)
// without passing callbacks through every layer. App.jsx listens with useAddProfileRequest.
const OPEN_ADD_PROFILE = 'myplano:open-add-profile';

export function requestAddProfile() {
  window.dispatchEvent(new CustomEvent(OPEN_ADD_PROFILE));
}

export function useAddProfileRequest(handler) {
  useEffect(() => {
    window.addEventListener(OPEN_ADD_PROFILE, handler);
    return () => window.removeEventListener(OPEN_ADD_PROFILE, handler);
  }, [handler]);
}

// Opens the "manage profiles" dialog (list, edit, delete) from anywhere, e.g. Settings.
// App.jsx listens with useManageProfilesRequest.
const OPEN_MANAGE_PROFILES = 'myplano:open-manage-profiles';

export function requestManageProfiles() {
  window.dispatchEvent(new CustomEvent(OPEN_MANAGE_PROFILES));
}

export function useManageProfilesRequest(handler) {
  useEffect(() => {
    window.addEventListener(OPEN_MANAGE_PROFILES, handler);
    return () => window.removeEventListener(OPEN_MANAGE_PROFILES, handler);
  }, [handler]);
}
