"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@/contexts/UserContext";

interface Artwork {
  id: number;
  title: string;
  image_id: string | null;
}

interface Comment {
  id: number;
  user: string;
  content: string;
  createdAt: string;
}

interface ArtworkWithUrl extends Artwork {
  imageUrl?: string;
}

export default function ArtPage() {
  const [artworks, setArtworks] = useState<ArtworkWithUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkWithUrl | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});
  const commentEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const scrollToBottom = () => {
    setTimeout(() => commentEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => {
    getArtworks();
  }, []);

  const getArtworks = async () => {
    console.log("entree get artworks")
    try {
      const response = await fetch("/api/artworks")
      const data = await response.json();

      const artworksWithUrl: ArtworkWithUrl[] = await Promise.all(
        data.map(async (art: Artwork) => {
          let imageUrl: string | undefined;
          if (art.image_id) {
            const res = await fetch(`/api/artworks/${art.image_id}`);
            const json = await res.json();
            imageUrl = json.url;
          }
          return { ...art, imageUrl };
        })
      );

      setArtworks(artworksWithUrl);
      loadAllCommentCounts(artworksWithUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (artworkId: number) => {
    console.log("entree dans loadcomments");
    try {
      const res = await fetch(`/api/comments/artwork/${artworkId}`);
      if (!res.ok) return setComments([]);
  
      const data = await res.json();
      if (!Array.isArray(data)) return setComments([]);
  
      setComments(
        data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      );
  
      scrollToBottom();
      console.log("Commentaires chargés :", data);
    } catch (err) {
      console.error("Erreur chargement commentaires:", err);
      setComments([]);
    }
  };
  

  const openCommentModal = async (artwork: ArtworkWithUrl) => {
    setSelectedArtwork(artwork);
    await loadComments(artwork.id);
    setCommentModalVisible(true);
  };

  const closeCommentModal = () => {
    setSelectedArtwork(null);
    setCommentModalVisible(false);
    setComment("");
  };

  const loadAllCommentCounts = async (arts: ArtworkWithUrl[]) => {
    const counts: Record<number, number> = {};
    for (const art of arts) {
      try {
        const res = await fetch(`/api/comments/artwork/${art.id}`);
        if (!res.ok) {
          counts[art.id] = 0;
          continue;
        }
        const text = await res.text();
        if (!text || text.trim() === "" || text === "undefined") {
          counts[art.id] = 0;
          continue;
        }
        const data = JSON.parse(text);
        counts[art.id] = Array.isArray(data) ? data.length : 0;
      } catch (err) {
        console.error(`Erreur chargement commentaires pour artwork ${art.id}:`, err);
        counts[art.id] = 0;
      }
    }
    setCommentCounts(counts);
  };

  const submitComment = async () => {
    if (!selectedArtwork || !comment.trim()) return;
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artwork: selectedArtwork.id,
          content: comment,
        }),
      });

      if (!response.ok) {
        console.error("Erreur lors de l’envoi du commentaire");
        return;
      }

      const newComment: Comment = {
        id: Math.random(),
        user: user?.username ?? "Inconnu",
        content: comment,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [...prev, newComment]);
      setComment("");
      scrollToBottom();
    } catch (error) {
      console.error("Erreur lors de l’envoi du commentaire:", error);
    }
  };

  if (loading) return <p>Chargement en cours...</p>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-8">
      <h1 className="text-3xl text-black font-bold mb-6">
        Hello {user?.username ?? "Inconnu"} voici nos proposition 
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((art) => (
          <div key={art.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow">

            {art.imageUrl && 
              <img src={art.imageUrl} alt={art.title} className="w-full h-48 object-cover" />
            }

            <div className="p-4 flex flex-col gap-6">
              <h2 className="text-lg text-black font-semibold">{art.title}</h2>
              <div className="flex justify-between">
                <button className="text-blue-600 underline" onClick={() => openCommentModal(art)}>
                  Laisser un commentaire
                </button>
                <p className="text-gray-500">{commentCounts[art.id] ?? 0} commentaires</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {commentModalVisible && selectedArtwork && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md flex flex-col p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 text-xl" onClick={closeCommentModal}>
              &times;
            </button>
            <h2 className="text-xl text-black font-bold mb-4">Discussions sur {selectedArtwork.title}</h2>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto mb-4 max-h-96">
              {comments.map((comment) => {
                const isCurrentUser = comment.user === user?.username;
                return (
                  <div
                    key={comment.id}
                    className={`p-2 rounded ${isCurrentUser ? "self-end bg-blue-500 text-white" : "self-start bg-gray-200 text-black"}`}
                  >
                    <strong>{comment.user}:</strong> {comment.content}
                    <div className="text-xs text-gray-700 mt-1">{new Date(comment.createdAt).toLocaleString()}</div>
                  </div>
                );
              })}
              <div ref={commentEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded p-2"
                placeholder="Écrivez un message..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitComment(); }}
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={submitComment}>
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
