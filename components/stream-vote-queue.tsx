"use client";
import { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown, Play, SkipForward, Share2, Loader } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import { Appbar } from './Appbar';

interface Video {
  id: string;
  title: string;
  votes: number;
  url: string;
  smallImageUrl: string;
  bigImageUrl: string;
  type: string;
  extractedId: string;
}

export default function StreamVoteQueue() {
  const session = useSession();
  const [videoLink, setVideoLink] = useState('')
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [queue, setQueue] = useState<Video[]>([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentVideo && queue.length > 0) {
      playNext();
    }
  }, [currentVideo, queue]);

  useEffect(() => {
    if (queue.length === 0) {
      console.log('Fetching streams');
      console.log(session.data?.user.id);
      try {
        axios.get(`http://localhost:3000/api/streams/?createrId=${session.data?.user.id}`).then((res) => {
          setQueue(res.data.streams);
        });
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    }
  }, []);

  const handleVideoEnd = async () => {
    if (currentVideo) {
      try {
        await axios.delete(`http://localhost:3000/api/streams/?streamId=${currentVideo.id}`);
        toast.success('Video played successfully!');
        playNext();
      } catch (error) {
        console.error("Error deleting stream:", error);
        toast.error('Failed to delete video');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const stream = await axios.post('http://localhost:3000/api/streams', {
        creatorId: session.data?.user.id,
        url: videoLink
      });
      setQueue([...queue, {
        id: stream.data.stream.id,
        title: stream.data.stream.title,
        votes: 0,
        url: stream.data.stream.url,
        smallImageUrl: stream.data.stream.smallImageUrl,
        bigImageUrl: stream.data.stream.bigImageUrl,
        type: stream.data.stream.type,
        extractedId: stream.data.stream.extractedId
      }]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = (id: string, increment: number) => {
    setQueue(queue.map(video =>
      video.id === id ? { ...video, votes: video.votes + increment } : video
    ).sort((a, b) => b.votes - a.votes))
  }

  const playNext = () => {
    if (queue.length > 0) {
      setCurrentVideo(queue[0]);
      setQueue(queue.slice(1));
    } else {
      setCurrentVideo(null);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Appbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-gray-800 bg-opacity-50 shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">Now Playing</h2>
            {currentVideo ? (
              <>
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <YouTube
                    videoId={currentVideo.extractedId} // Use YouTube video ID
                    opts={{
                      width: '100%',
                      playerVars: {
                        autoplay: 1, // Auto-play video
                      },
                    }}
                    onEnd={handleVideoEnd} // Auto-play next video on end
                  />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">{currentVideo.title}</h3>
                  <Button onClick={playNext} className="bg-purple-600 hover:bg-purple-700 text-white">
                    <SkipForward className="h-4 w-4 mr-2" />
                    Play Next
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-gray-300">No video currently playing</p>
            )}
          </section>

          <section className="bg-gray-800 bg-opacity-50 shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">Add a Song</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="videoLink" className="block text-sm font-medium text-gray-300">
                  YouTube Video Link
                </label>
                <Input
                  type="text"
                  id="videoLink"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                {loading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : "Add to Queue"}
              </Button>
            </form>
          </section>
        </div>

        <section className="bg-gray-800 bg-opacity-50 shadow rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">Upcoming Songs</h2>
          {queue.length > 0 ? (
            <ul className="space-y-4">
              {queue.map((video) => (
                <li key={video.id} className="flex items-center justify-between bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Image
                      src={`https://img.youtube.com/vi/${video.extractedId}/default.jpg`}
                      alt={video.title}
                      width={80}
                      height={60}
                      className="rounded mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                      <p className="text-gray-300">Votes: {video.votes}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={() => handleVote(video.id, 1)} variant="outline" size="icon" className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleVote(video.id, -1)} variant="outline" size="icon" className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">No songs in the queue</p>
          )}
        </section>
      </main>

      <footer className="bg-gray-800 bg-opacity-50 border-t border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © 2024 StreamVote. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
