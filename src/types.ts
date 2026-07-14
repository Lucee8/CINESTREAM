export interface Channel {
  name: string;
  avatar: string;
  subscribers: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  uploadedAt: string;
  category: string;
  channel: Channel;
  likes: string;
}
