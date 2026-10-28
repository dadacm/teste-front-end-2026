
    export type RemoteKeys = 'mf_videos/VideosPage' | 'mf_videos/FavoritesPage';
    type PackageType<T> = T extends 'mf_videos/FavoritesPage' ? typeof import('mf_videos/FavoritesPage') :T extends 'mf_videos/VideosPage' ? typeof import('mf_videos/VideosPage') :any;