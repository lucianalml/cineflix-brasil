export class Video {
  constructor(public id?: string,
    public title?: string,
    public description?: string,
    public thumbnails?: {
      default: string,
      high: string,
      medium: string },
    public tags?: string[],
    ) {}

}
