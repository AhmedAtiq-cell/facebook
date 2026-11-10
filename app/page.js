
'use client';

import { useState, useEffect } from "react";

import {
  Search,
  HomeIcon,
  Users,
  Video,
  Store,
  Gamepad2,
  Menu,
  MessageCircle,
  Bell,
  ChevronDown,
  UsersRound,
  UserRound,
  Clock,
  Bookmark,
  CalendarDays,
  Flag,
  Heart,
  Plus,
  X,
  Image as ImageIcon,
  Type
} from "lucide-react";

export default function Home() {

  // ==========================================
  // DATABASE FUNCTIONS
  // ==========================================

  function openFacebookDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("facebookCloneDB", 1);

      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("appData")) {
          request.result.createObjectStore("appData");
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function loadFromDB(key) {
    const db = await openFacebookDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("appData", "readonly");
      const request = transaction.objectStore("appData").get(key);

      request.onsuccess = () => {
        resolve(request.result || []);
        db.close();
      };

      request.onerror = () => {
        reject(request.error);
        db.close();
      };
    });
  }

  async function saveToDB(key, data) {
    const db = await openFacebookDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("appData", "readwrite");

      transaction.objectStore("appData").put(data, key);

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };

      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  }

  function imageToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);

      reader.readAsDataURL(file);
    });
  }

  // ==========================================
  // REACT STATES
  // ==========================================

  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [postImage, setPostImage] = useState(null);
  const [postsLoaded, setPostsLoaded] = useState(false);

  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});

  // Stories
  const [userStories, setUserStories] = useState([]);
  const [storiesLoaded, setStoriesLoaded] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  // Create Story Modal
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyType, setStoryType] = useState("photo");
  const [storyImage, setStoryImage] = useState(null);
  const [storyImagePreview, setStoryImagePreview] = useState("");
  const [storyText, setStoryText] = useState("");
  const [storyCaption, setStoryCaption] = useState("");
  const [storyBackground, setStoryBackground] = useState(
    "bg-gradient-to-br from-purple-600 to-blue-600"
  );
  // ==========================================
// MESSAGING STATES
// ==========================================

const [messages, setMessages] = useState({});
const [messagesLoaded, setMessagesLoaded] = useState(false);

const [activeChat, setActiveChat] = useState(null);
const [messageText, setMessageText] = useState("");
const [replyingAsFriend, setReplyingAsFriend] = useState(false);
const [selectedMessageId, setSelectedMessageId] = useState(null);

const friends = [
  {
    id: "johar",
    name: "Johar Ali",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
  },
  {
    id: "anas",
    name: "Anas Waheed",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100"
  },
  {
    id: "ahmad",
    name: "Ahmad Ishfaq",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
  },
  {
    id: "reshael",
    name: "Reshael Asif",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100"
  }
];

  const storyBackgrounds = [
    "bg-gradient-to-br from-purple-600 to-blue-600",
    "bg-gradient-to-br from-pink-500 to-red-500",
    "bg-gradient-to-br from-green-500 to-teal-600",
    "bg-gradient-to-br from-orange-500 to-yellow-500",
    "bg-gradient-to-br from-gray-800 to-black",
    "bg-gradient-to-br from-indigo-600 to-purple-800"
  ];

  // ==========================================
  // DEFAULT STORIES
  // ==========================================

  const defaultStories = [
    {
      id: "default-1",
      name: "Johar Ali",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      type: "photo"
    },
    {
      id: "default-2",
      name: "Anas Waheed",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
      type: "photo"
    },
    {
      id: "default-3",
      name: "Ahmad Ishfaq",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      type: "photo"
    },
    {
      id: "default-4",
      name: "Reshael Asif",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=800",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100",
      type: "photo"
    }
  ];

  // User stories appear before default stories.
  const stories = [...userStories, ...defaultStories];

  // ==========================================
  // LOAD AND SAVE DATA
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const savedPosts = await loadFromDB("posts");
const savedStories = await loadFromDB("stories");
const savedMessages = await loadFromDB("messages");

        if (isMounted) {
          setPosts(savedPosts);
setUserStories(savedStories);
setMessages(
  Array.isArray(savedMessages) ? {} : savedMessages
);
        }
      } catch (error) {
        console.error("Could not load saved data:", error);
      } finally {
        if (isMounted) {
          setPostsLoaded(true);
          setStoriesLoaded(true);
          setMessagesLoaded(true);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!postsLoaded) return;

    saveToDB("posts", posts).catch((error) => {
      console.error("Could not save posts:", error);
    });
  }, [posts, postsLoaded]);

  useEffect(() => {
    if (!storiesLoaded) return;

    saveToDB("stories", userStories).catch((error) => {
      console.error("Could not save stories:", error);
    });
  }, [userStories, storiesLoaded]);
  useEffect(() => {
  if (!messagesLoaded) return;

  saveToDB("messages", messages).catch((error) => {
    console.error("Could not save messages:", error);
  });
}, [messages, messagesLoaded]);

  // ==========================================
  // CREATE POST
  // ==========================================

  async function handlePostSubmit(e) {
    e.preventDefault();

    if (!postText.trim() && !postImage) return;

    let imageData = null;

    try {
      if (postImage) {
        imageData = await imageToDataURL(postImage);
      }
    } catch (error) {
      console.error("Could not read image:", error);
      return;
    }

    const newPost = {
      id: Date.now(),
      text: postText,
      time: "Just now",
      likes: 0,
      liked: false,
      image: imageData,
      comments: []
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);

    setPostText("");
    setPostImage(null);

    e.target.reset();
  }

  // ==========================================
  // LIKE POST
  // ==========================================

  function handleLike(postId) {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked
                ? post.likes - 1
                : post.likes + 1
            }
          : post
      )
    );
  }

  // ==========================================
  // DELETE POST
  // ==========================================

  function handleDeletePost(postId) {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId)
    );
  }

  // ==========================================
  // COMMENTS
  // ==========================================

  function handleCommentSubmit(e, postId) {
    e.preventDefault();

    const text = commentText[postId]?.trim();

    if (!text) return;

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...(post.comments || []),
                {
                  id: Date.now(),
                  text,
                  time: "Just now"
                }
              ]
            }
          : post
      )
    );

    setCommentText((current) => ({
      ...current,
      [postId]: ""
    }));
  }

  function toggleComments(postId) {
    setOpenComments((current) => ({
      ...current,
      [postId]: !current[postId]
    }));
  }

  // ==========================================
  // SHARE POST
  // ==========================================

  async function handleShare(post) {
    const shareData = {
      title: "Facebook Clone Post",
      text: post.text || "Check out this post!",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`
        );

        alert("Post link copied!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Sharing failed:", error);
        alert("Could not share this post.");
      }
    }
  }

  // ==========================================
  // CREATE STORY FUNCTIONS
  // ==========================================

  function openCreateStory() {
    setStoryType("photo");
    setStoryImage(null);
    setStoryImagePreview("");
    setStoryText("");
    setStoryCaption("");
    setStoryBackground(storyBackgrounds[0]);
    setShowStoryModal(true);
  }

  function closeCreateStory() {
    setShowStoryModal(false);
  }

  async function handleStoryImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setStoryImage(file);

    try {
      const imageData = await imageToDataURL(file);
      setStoryImagePreview(imageData);
    } catch (error) {
      console.error("Could not preview image:", error);
      alert("Could not load this image.");
    }
  }

  async function handleStorySubmit(e) {
    e.preventDefault();

    if (storyType === "photo" && !storyImagePreview) {
      alert("Please select a photo first.");
      return;
    }

    if (storyType === "text" && !storyText.trim()) {
      alert("Please write something for your story.");
      return;
    }

    const newStory = {
      id: Date.now(),
      name: "You",
      type: storyType,
      image: storyType === "photo" ? storyImagePreview : null,
      text: storyType === "text" ? storyText.trim() : "",
      caption: storyType === "photo" ? storyCaption.trim() : "",
      background: storyBackground,
      avatar: null,
      time: "Just now"
    };

    setUserStories((currentStories) => [
      newStory,
      ...currentStories
    ]);

    setShowStoryModal(false);
    setStoryImage(null);
    setStoryImagePreview("");
    setStoryText("");
    setStoryCaption("");

    // Open the newly created story.
    setActiveStoryIndex(0);
  }

  // ==========================================
  // STORY NAVIGATION
  // ==========================================

  function openStory(index) {
    setActiveStoryIndex(index);
  }

  function closeStory() {
    setActiveStoryIndex(null);
  }

  function nextStory() {
    setActiveStoryIndex((current) =>
      current === null
        ? null
        : (current + 1) % stories.length
    );
  }

  function previousStory() {
    setActiveStoryIndex((current) =>
      current === null
        ? null
        : (current - 1 + stories.length) % stories.length
    );
  }
  
  // ==========================================
  // MESSAGING FUNCTIONS
  // ==========================================

  function openChat(friend) {
  setActiveChat(friend);
  setMessageText("");
  setReplyingAsFriend(false);
}

function closeChat() {
  setActiveChat(null);
  setMessageText("");
  setReplyingAsFriend(false);
}

  function handleMessageSubmit(e) {
    e.preventDefault();

    const text = messageText.trim();

    if (!text || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      text,
      sender: replyingAsFriend ? activeChat.name : "You",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setMessages((currentMessages) => ({
      ...currentMessages,
      [activeChat.id]: [
        ...(currentMessages[activeChat.id] || []),
        newMessage
      ]
    }));

    setMessageText("");
  }
  function deleteMessage(friendId, messageId) {
  setMessages((currentMessages) => ({
    ...currentMessages,
    [friendId]: (currentMessages[friendId] || []).filter(
      (message) => message.id !== messageId
    )
  }));
}


  // ==========================================
  // PAGE JSX
  // ==========================================

  return (

    <main className="min-h-screen bg-gray-100">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sticky top-0 z-50">

        <div className="flex items-center gap-3">

          <h1 className="text-3xl font-bold text-blue-600">
            facebook
          </h1>

          <div className="bg-gray-100 rounded-full flex items-center px-3 py-2 gap-2">
            <Search size={20} className="text-gray-500" />

            <input
              type="text"
              placeholder="Search Facebook"
              className="bg-transparent outline-none w-40"
            />
          </div>

        </div>

        <div className="hidden md:flex items-center justify-center gap-2 h-full">

          <button className="h-full px-8 border-b-4 border-blue-600 text-blue-600">
            <HomeIcon size={26} />
          </button>

          <button className="h-full px-8 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Video size={26} />
          </button>

          <button className="h-full px-8 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Store size={26} />
          </button>

          <button className="h-full px-8 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Users size={26} />
          </button>

          <button className="h-full px-8 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Gamepad2 size={26} />
          </button>

        </div>

        <div className="flex items-center gap-3">

          <button className="bg-gray-200 rounded-full p-3 hover:bg-gray-300">
            <Menu size={21} />
          </button>

          <button className="bg-gray-200 rounded-full p-3 hover:bg-gray-300">
            <MessageCircle size={21} />
          </button>

          <button className="bg-gray-200 rounded-full p-3 hover:bg-gray-300">
            <Bell size={21} />
          </button>

          <button className="bg-gray-200 rounded-full p-3 hover:bg-gray-300">
            <ChevronDown size={21} />
          </button>

        </div>

      </nav>

      {/* ======================================
          MAIN LAYOUT
      ====================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-5">

        {/* LEFT SIDEBAR */}

        <aside className="hidden lg:block space-y-2">

          <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
            <div className="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center">
              <UserRound size={22} className="text-blue-700" />
            </div>
            <span className="font-semibold">Your Profile</span>
          </div>

          <div className="space-y-1">

            <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <Users className="text-blue-600" size={25} />
              <span className="font-medium">Friends</span>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <Clock className="text-blue-600" size={25} />
              <span className="font-medium">Memories</span>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <Bookmark className="text-purple-600" size={25} />
              <span className="font-medium">Saved</span>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <UsersRound className="text-blue-600" size={25} />
              <span className="font-medium">Groups</span>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <Video className="text-red-500" size={25} />
              <span className="font-medium">Video</span>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <Store className="text-blue-500" size={25} />
              <span className="font-medium">Marketplace</span>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <CalendarDays className="text-red-500" size={25} />
              <span className="font-medium">Events</span>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <Gamepad2 className="text-purple-600" size={25} />
              <span className="font-medium">Gaming</span>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <Flag className="text-orange-500" size={25} />
              <span className="font-medium">Pages</span>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <Heart className="text-red-500" size={25} />
              <span className="font-medium">Fundraisers</span>
            </div>

          </div>

          <hr className="my-4" />

          <h2 className="font-bold text-gray-600 px-3 py-2">
            Your Shortcuts
          </h2>

          <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
            <div className="w-9 h-9 bg-purple-200 rounded-lg flex items-center justify-center">
              <UsersRound size={22} className="text-purple-700" />
            </div>
            <span className="font-medium">Web Development</span>
          </div>

          <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
            <div className="w-9 h-9 bg-green-200 rounded-lg flex items-center justify-center">
              <Gamepad2 size={22} className="text-green-700" />
            </div>
            <span className="font-medium">Gaming Community</span>
          </div>

        </aside>

        {/* ======================================
            NEWS FEED
        ====================================== */}

        <section className="lg:col-span-2 space-y-5">

          {/* CREATE POST */}

          <div className="bg-white rounded-xl shadow p-4">

            <h2 className="font-bold text-lg mb-3">
              Create Post
            </h2>

            <form onSubmit={handlePostSubmit}>

              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-gray-100 rounded-xl p-3 outline-none resize-none"
                rows="3"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPostImage(e.target.files[0] || null)}
                className="mt-3"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg mt-3 hover:bg-blue-700"
              >
                Post
              </button>

            </form>

          </div>

          {/* ======================================
              STORIES SECTION
          ====================================== */}

          <div className="bg-white rounded-xl shadow p-4">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-bold">
                Stories
              </h2>

              <button
                type="button"
                onClick={() => openStory(0)}
                className="text-blue-600 font-semibold"
              >
                See all
              </button>

            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">

              {/* CREATE STORY CARD */}

              <button
                type="button"
                onClick={openCreateStory}
                className="min-w-[125px] h-52 rounded-xl overflow-hidden shadow hover:brightness-95 text-center"
              >

                <div className="h-36 bg-gray-300 flex items-center justify-center">

                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Plus size={30} className="text-white" />
                  </div>

                </div>

                <div className="h-16 flex flex-col items-center justify-center">

                  <p className="font-bold text-sm">
                    Create Story
                  </p>

                  <p className="text-xs text-gray-500">
                    Share a moment
                  </p>

                </div>

              </button>

              {/* STORY CARDS */}

              {stories.map((story, index) => (

                <button
                  type="button"
                  key={story.id}
                  onClick={() => openStory(index)}
                  className={`min-w-[125px] h-52 rounded-xl relative overflow-hidden shadow hover:brightness-90 text-left ${
                    story.type === "text"
                      ? story.background
                      : "bg-gray-200"
                  }`}
                  style={
                    story.type === "photo"
                      ? {
                          backgroundImage: `url('${story.image}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }
                      : {}
                  }
                >

                  {story.type === "text" && (
                    <p className="absolute inset-3 flex items-center justify-center text-white text-center font-bold text-sm">
                      {story.text}
                    </p>
                  )}

                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-4 border-blue-500 overflow-hidden bg-blue-600 flex items-center justify-center">

                    {story.avatar || story.image ? (
                      <img
                        src={story.avatar || story.image}
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold">U</span>
                    )}

                  </div>

                  {story.caption && (
                    <p className="absolute bottom-10 left-2 right-2 text-white text-xs font-semibold">
                      {story.caption}
                    </p>
                  )}

                  <p className="absolute bottom-3 left-3 text-white font-bold text-sm drop-shadow-lg">
                    {story.name}
                  </p>

                </button>

              ))}

            </div>

          </div>

          {/* ======================================
              CREATE STORY MODAL
          ====================================== */}

          {showStoryModal && (

            <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-3 overflow-y-auto">

              <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* MODAL HEADER */}

                <div className="flex items-center justify-between p-4 border-b shrink-0">

                  <h2 className="text-xl font-bold">
                    Create Story
                  </h2>

                  <button
                    type="button"
                    onClick={closeCreateStory}
                    className="bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                  >
                    <X size={22} />
                  </button>

                </div>

                <form onSubmit={handleStorySubmit} className="flex flex-col flex-1 min-h-0">

                  <div className="p-5 space-y-4 overflow-y-auto">

                    {/* STORY TYPE SELECTOR */}

                    <div className="grid grid-cols-2 gap-3">

                      <button
                        type="button"
                        onClick={() => setStoryType("photo")}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg font-semibold border-2 ${
                          storyType === "photo"
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-gray-200 text-gray-600"
                        }`}
                      >
                        <ImageIcon size={20} />
                        Photo Story
                      </button>

                      <button
                        type="button"
                        onClick={() => setStoryType("text")}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg font-semibold border-2 ${
                          storyType === "text"
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-gray-200 text-gray-600"
                        }`}
                      >
                        <Type size={20} />
                        Text Story
                      </button>

                    </div>

                    {/* PHOTO STORY */}

                    {storyType === "photo" && (

                      <div className="space-y-3">

                        <label className="block font-semibold text-gray-700">
                          Select a photo
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleStoryImageChange}
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />

                        {storyImagePreview && (

                          <div className="relative bg-gray-100 rounded-xl overflow-hidden">

                            <img
                              src={storyImagePreview}
                              alt="Story preview"
                              className="w-full max-h-80 object-contain"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                setStoryImage(null);
                                setStoryImagePreview("");
                              }}
                              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-2"
                            >
                              <X size={18} />
                            </button>

                          </div>

                        )}

                        <textarea
                          value={storyCaption}
                          onChange={(e) => setStoryCaption(e.target.value)}
                          placeholder="Write a caption (optional)..."
                          rows="2"
                          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 resize-none"
                        />

                      </div>

                    )}

                    {/* TEXT STORY */}

                    {storyType === "text" && (

                      <div className="space-y-3">

                        <label className="block font-semibold text-gray-700">
                          Your story message
                        </label>

                        <textarea
                          value={storyText}
                          onChange={(e) => setStoryText(e.target.value)}
                          placeholder="What's happening?"
                          rows="4"
                          maxLength={250}
                          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 resize-none"
                        />

                        <p className="text-right text-xs text-gray-500">
                          {storyText.length}/250
                        </p>

                        <label className="block font-semibold text-gray-700">
                          Choose a background
                        </label>

                        <div className="flex flex-wrap gap-3">

                          {storyBackgrounds.map((background) => (

                            <button
                              key={background}
                              type="button"
                              onClick={() => setStoryBackground(background)}
                              className={`w-12 h-12 rounded-full ${background} ${
                                storyBackground === background
                                  ? "ring-4 ring-blue-500 ring-offset-2"
                                  : ""
                              }`}
                              aria-label="Choose background"
                            />

                          ))}

                        </div>

                        {/* TEXT STORY PREVIEW */}

                        <div className={`min-h-48 rounded-xl ${storyBackground} flex items-center justify-center p-6`}>

                          <p className="text-white text-center text-xl font-bold break-words">
                            {storyText || "Your story preview will appear here"}
                          </p>

                        </div>

                      </div>

                    )}

                  </div>

                  {/* SHARE BUTTON */}

                  <div className="p-4 border-t shrink-0">

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
                    >
                      Share to Story
                    </button>

                  </div>

                </form>

              </div>

            </div>

          )}

          {/* ======================================
              STORY VIEWER
          ====================================== */}

          {activeStoryIndex !== null && stories[activeStoryIndex] && (

            <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">

              {/* CLOSE */}

              <button
                type="button"
                onClick={closeStory}
                className="absolute top-5 right-5 text-white text-4xl hover:text-gray-300 z-20"
                aria-label="Close story"
              >
                &times;
              </button>

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={previousStory}
                className="absolute left-4 md:left-10 bg-white/20 text-white rounded-full w-12 h-12 text-3xl hover:bg-white/40 z-20"
                aria-label="Previous story"
              >
                &#8249;
              </button>

              {/* STORY CONTENT */}

              <div className="relative w-full max-w-md h-[80vh] max-h-[750px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl">

                {/* STORY PROGRESS */}

                <div className="absolute top-3 left-3 right-3 z-10 flex gap-1">

                  {stories.map((story, index) => (

                    <div
                      key={story.id}
                      className="h-1 flex-1 rounded-full bg-white/40 overflow-hidden"
                    >

                      <div
                        className={`h-full rounded-full ${
                          index <= activeStoryIndex
                            ? "bg-white"
                            : "bg-transparent"
                        }`}
                      />

                    </div>

                  ))}

                </div>

                {/* STORY OWNER */}

                <div className="absolute top-7 left-4 z-10 flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-blue-600 flex items-center justify-center">

                    {stories[activeStoryIndex].avatar ||
                    stories[activeStoryIndex].image ? (

                      <img
                        src={
                          stories[activeStoryIndex].avatar ||
                          stories[activeStoryIndex].image
                        }
                        alt={stories[activeStoryIndex].name}
                        className="w-full h-full object-cover"
                      />

                    ) : (
                      <span className="text-white font-bold">U</span>
                    )}

                  </div>

                  <div>
                    <p className="text-white font-bold">
                      {stories[activeStoryIndex].name}
                    </p>

                    <p className="text-white/70 text-xs">
                      {stories[activeStoryIndex].time || "Recently"}
                    </p>
                  </div>

                </div>

                {/* PHOTO STORY */}

                {stories[activeStoryIndex].type === "photo" && (

                  <div className="w-full h-full flex flex-col">

                    <img
                      src={stories[activeStoryIndex].image}
                      alt="Story"
                      className="w-full h-full object-contain"
                    />

                    {stories[activeStoryIndex].caption && (

                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-5">
                        <p className="text-white text-center">
                          {stories[activeStoryIndex].caption}
                        </p>
                      </div>

                    )}

                  </div>

                )}

                {/* TEXT STORY */}

                {stories[activeStoryIndex].type === "text" && (

                  <div className={`w-full h-full flex items-center justify-center p-8 ${
                    stories[activeStoryIndex].background
                  }`}>

                    <p className="text-white text-center text-3xl font-bold break-words">
                      {stories[activeStoryIndex].text}
                    </p>

                  </div>

                )}

              </div>

              {/* NEXT */}

              <button
                type="button"
                onClick={nextStory}
                className="absolute right-4 md:right-10 bg-white/20 text-white rounded-full w-12 h-12 text-3xl hover:bg-white/40 z-20"
                aria-label="Next story"
              >
                &#8250;
              </button>

            </div>

          )}

          {/* ======================================
              POSTS
          ====================================== */}

          {posts.map((post) => (

            <div
              key={post.id}
              className="flex flex-col xl:flex-row items-start gap-4 mb-5"
            >

              {/* POST CARD */}

              <div className="flex-1 min-w-0 w-full bg-white rounded-xl shadow p-5">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-11 h-11 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
                    U
                  </div>

                  <div>
                    <h3 className="font-bold">You</h3>

                    <p className="text-gray-500 text-sm">
                      {post.time}
                    </p>
                  </div>

                </div>

                {post.text && (
                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">
                    {post.text}
                  </p>
                )}

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full max-h-[500px] object-contain rounded-lg mb-4"
                  />
                )}

                <div className="flex justify-between text-gray-500 text-sm py-3">

                  <span>
                    👍 {post.likes} Likes
                  </span>

                  <span>
                    {post.comments?.length || 0} Comments
                  </span>

                </div>

                <hr />

                <div className="flex flex-wrap justify-around gap-2 pt-3 text-gray-600 font-medium">

                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className="flex-1 rounded-lg py-2 hover:bg-gray-100"
                  >
                    {post.liked ? "👍 Liked" : "👍 Like"}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleComments(post.id)}
                    className="flex-1 rounded-lg py-2 hover:bg-gray-100"
                  >
                    💬 Comment
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(post)}
                    className="flex-1 rounded-lg py-2 hover:bg-gray-100"
                  >
                    ↗ Share
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    className="flex-1 rounded-lg py-2 hover:bg-red-100 text-red-600"
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

              {/* COMMENTS PANEL */}

              {openComments[post.id] && (

                <div className="w-full xl:w-80 xl:shrink-0 bg-white rounded-xl shadow p-4">

                  <h3 className="font-bold text-lg mb-4">
                    Comments
                  </h3>

                  <div className="max-h-80 overflow-y-auto mb-4">

                    {post.comments?.length > 0 ? (

                      post.comments.map((comment) => (

                        <div
                          key={comment.id}
                          className="mb-3 rounded-lg bg-gray-100 p-3"
                        >

                          <p className="text-sm font-semibold">
                            You
                          </p>

                          <p className="text-sm break-words">
                            {comment.text}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {comment.time}
                          </p>

                        </div>

                      ))

                    ) : (

                      <p className="text-sm text-gray-500">
                        No comments yet.
                      </p>

                    )}

                  </div>

                  <form
                    onSubmit={(e) => handleCommentSubmit(e, post.id)}
                    className="flex gap-2"
                  >

                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText[post.id] || ""}
                      onChange={(e) =>
                        setCommentText((current) => ({
                          ...current,
                          [post.id]: e.target.value
                        }))
                      }
                      className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                    />

                    <button
                      type="submit"
                      className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Send
                    </button>

                  </form>

                </div>

              )}

            </div>

          ))}

        </section>

        {/* ======================================
            RIGHT SIDEBAR
        ====================================== */}

        <aside className="hidden lg:block space-y-5">

          <h2 className="font-bold text-xl">
            Contacts
          </h2>

          
  <div className="space-y-2">

    {friends.map((friend) => (
      <button
        key={friend.id}
        type="button"
        onClick={() => openChat(friend)}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 text-left"
      >
        <div className="relative">
          <img
            src={friend.avatar}
            alt={friend.name}
            className="w-10 h-10 rounded-full object-cover"
          />

          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>

        <span className="font-medium">{friend.name}</span>
      </button>
    ))}

  </div>


        </aside>

      </div>
      
      {/* ======================================
          MESSENGER CHAT WINDOW
      ====================================== */}

      {activeChat && (

        <div className="fixed bottom-0 right-4 z-[90] w-[calc(100%-2rem)] sm:w-96 bg-white rounded-t-xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden">

          {/* CHAT HEADER */}

          <div className="flex items-center justify-between p-3 border-b shadow-sm">

            <div className="flex items-center gap-3">

              <div className="relative">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              <div>
                <h3 className="font-bold">
                  {activeChat.name}
                </h3>

                <p className="text-xs text-green-600">
                  Active now
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={closeChat}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              aria-label="Close chat"
            >
              <X size={22} />
            </button>

          </div>

          {/* MESSAGE AREA */}

          <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3">

            <div className="text-center text-xs text-gray-400 mb-3">
              Conversation with {activeChat.name}
            </div>

            {(messages[activeChat.id] || []).length === 0 ? (

  <div className="flex-1 flex items-center justify-center text-center">
    <div>
      <img
        src={activeChat.avatar}
        alt={activeChat.name}
        className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
      />

      <p className="font-semibold text-gray-700">
        {activeChat.name}
      </p>

      <p className="text-sm text-gray-500">
        Start your conversation!
      </p>
    </div>
  </div>

) : (

  (messages[activeChat.id] || []).map((message) => (

    <div
  key={message.id}
  onContextMenu={(e) => {
    e.preventDefault();
    setSelectedMessageId(message.id);
  }}
  className={`flex ${
    message.sender === "You"
      ? "justify-end"
      : "justify-start"
  }`}
>

      <div className="max-w-[80%]">

        <div
          className={`rounded-2xl px-4 py-2 ${
            message.sender === "You"
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-200 text-gray-800 rounded-bl-sm"
          }`}
        >

          <p className="break-words whitespace-pre-wrap">
            {message.text}
          </p>

          <p className={`text-[10px] mt-1 ${
            message.sender === "You"
              ? "text-blue-100"
              : "text-gray-500"
          }`}>
            {message.time}
          </p>

        </div>

        {selectedMessageId === message.id && (

  <div className={`mt-1 flex ${
    message.sender === "You"
      ? "justify-end"
      : "justify-start"
  }`}>

    <button
      onClick={() => {
        deleteMessage(activeChat.id, message.id);
        setSelectedMessageId(null);
      }}
      className="text-xs text-red-500 hover:text-red-700 hover:underline"
    >
      Delete
    </button>
  </div>
)}
        </div>
      </div>
  ))

)}

          </div>

          {/* MESSAGE INPUT */}

          <form
            onSubmit={handleMessageSubmit}
            className="p-3 border-t flex items-center gap-2"
          >
            <button
  type="button"
  onClick={() => setReplyingAsFriend(!replyingAsFriend)}
  className="px-3 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg"
>
  {replyingAsFriend ? "Switch to You" : `Reply as ${activeChat.name}`}
</button>

            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-w-0 bg-gray-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              disabled={!messageText.trim()}
              className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:opacity-40"
              aria-label="Send message"
            >
              <MessageCircle size={20} />
            </button>

          </form>

        </div>

      )}


    </main>
  );
}
