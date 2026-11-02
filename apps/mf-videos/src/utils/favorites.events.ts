import { FAVORITES_UPDATED_EVENT, type FavoritesUpdatedDetail } from "@icasei/contracts";

export function notifyFavoritesUpdated(count: number): void {
  const event = new CustomEvent<FavoritesUpdatedDetail>(FAVORITES_UPDATED_EVENT, {
    detail: { count },
  });

  window.dispatchEvent(event);
}
