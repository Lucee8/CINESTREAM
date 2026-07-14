import { db, collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from './firebase';
import { Video } from '../types';
import { mockVideos } from '../data/mockVideos';

const VIDEOS_COLLECTION = 'videos';

export async function getVideosFromDb(): Promise<Video[]> {
  try {
    const videoCol = collection(db, VIDEOS_COLLECTION);
    const videoSnapshot = await getDocs(videoCol);
    const videoList = videoSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Video[];

    if (videoList.length === 0) {
      // Seed videos if collection is empty
      console.log('No videos found in Firestore. Seeding with mock videos...');
      for (const video of mockVideos) {
        await setDoc(doc(db, VIDEOS_COLLECTION, video.id), video);
      }
      return mockVideos;
    }

    return videoList;
  } catch (error) {
    console.error('Error fetching videos from Firestore:', error);
    // Fallback to mock videos on failure/permission error
    return mockVideos;
  }
}

export async function addVideoToDb(video: Video): Promise<void> {
  const videoCol = collection(db, VIDEOS_COLLECTION);
  // Save with the specific ID or generate a new one
  const videoId = video.id || doc(videoCol).id;
  const newVideo = { ...video, id: videoId };
  await setDoc(doc(db, VIDEOS_COLLECTION, videoId), newVideo);
}

export async function updateVideoInDb(videoId: string, updatedFields: Partial<Video>): Promise<void> {
  const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
  await updateDoc(videoRef, updatedFields);
}

export async function deleteVideoFromDb(videoId: string): Promise<void> {
  const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
  await deleteDoc(videoRef);
}
