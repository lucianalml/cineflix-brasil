import { PlaylistItem } from './playlistItem';

export class Playlist {
  constructor(public id?: string,
    public title?: string,
    public itens?: PlaylistItem[]
    ) {}
}
