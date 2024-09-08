import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; 
import { FaArrowRight, FaStop, FaMicrophone, FaVolumeUp } from "react-icons/fa"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faTimes } from '@fortawesome/free-solid-svg-icons';

function Chatbox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [typingInterval, setTypingInterval] = useState(null); 
  const [chatVisible, setChatVisible] = useState(false); 
  const chatBoxRef = useRef(null); 

 
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesisRef.current.getVoices();
      const femaleVoice = voices.find(voice => voice.name.includes("Female") || voice.gender === "female");
      setVoice(femaleVoice || voices[0]); 
    };

    
    loadVoices();

    
    speechSynthesisRef.current.onvoiceschanged = loadVoices;
  }, []);

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();

    setDisplayedAnswer(""); 
    setMessage(""); 

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

     
      const fullAnswer = response.data.candidates[0].content.parts[0].text;

      let index = 0;

      
      if (typingInterval) {
        clearInterval(typingInterval);
      }

     
      const interval = setInterval(() => {
        setDisplayedAnswer((prev) => prev + fullAnswer[index]);
        index += 1;
        if (index >= fullAnswer.length) {
          clearInterval(interval);
          setAnswer(fullAnswer); 
          setGeneratingAnswer(false);
          
          speakText(fullAnswer);
        }
      }, 30); 
      setTypingInterval(interval);
    } catch (error) {
      console.log(error);
      setDisplayedAnswer("");
      setAnswer("Sorry - Something went wrong. Please try again!");
      setGeneratingAnswer(false);
    }
  }

  function stopTyping() {
    if (typingInterval) {
      clearInterval(typingInterval);
      setTypingInterval(null);
      setGeneratingAnswer(false); 
    }
  }

  function speakText(text) {
    if (speechSynthesisRef.current && voice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = "en-US";
      speechSynthesisRef.current.speak(utterance);
    }
  }

  function stopSpeech() {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel(); 
    }
  }

  function startSpeechRecognition() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setQuestion(speechToText);
    };

    recognition.start();
  }

  
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [displayedAnswer]);

  return (
    <>
     
      <button
        onClick={() => setChatVisible(!chatVisible)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center z-50"
      >
        <FontAwesomeIcon icon={chatVisible ? faTimes : faCommentDots} />
      </button>

      
      {chatVisible && (
        <div className="fixed bottom-16 right-0 w-full md:w-80 lg:w-96 h-4/5 md:h-4/5 lg:h-4/5 bg-white rounded-t-lg shadow-lg p-4 max-w-xs md:max-w-lg lg:max-w-xl overflow-hidden">
          <form
            onSubmit={generateAnswer}
            className="w-full text-center rounded-lg shadow-2xl bg-white py-8 px-6 overflow-auto"
          >
            <textarea
              required
              className="border border-gray-300 rounded-xl w-full my-4 p-4 text-lg transition-all duration-300 focus:border-pink-600 focus:ring-2 focus:ring-pink-500 placeholder-pink-500 bg-pink-50 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="How can I help you? I am Disaster AI"
              rows="4"
            ></textarea>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <button
                type="submit"
                className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center ${
                  generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={generatingAnswer}
              >
                {generatingAnswer && (
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                )}
                <FaArrowRight className="ml-2" />
              </button>
              {generatingAnswer && (
                <button
                  type="button"
                  onClick={stopTyping}
                  className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
                >
                  <FaStop className="mr-2" />
                  Stop
                </button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={startSpeechRecognition}
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
              >
                <FaMicrophone className="mr-2" />
                Speak
              </button>
              <button
                type="button"
                onClick={() => speakText(displayedAnswer)}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center"
              >
                <FaVolumeUp className="mr-2" />
                Read Aloud
              </button>
              <button
                type="button"
                onClick={stopSpeech}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
              >
                <FaStop className="mr-2" />
                Stop Reading
              </button>
            </div>
            {message && (
              <div className="text-red-500 mt-4 text-sm font-medium">
                {message}
              </div>
            )}
          </form>
          <div
            className="w-full text-left rounded-xl bg-white mt-6 shadow-2xl transition-all duration-500 transform hover:scale-105 p-6 relative overflow-y-auto"
            style={{ maxHeight: 'calc(100% - 200px)' }} 
            ref={chatBoxRef}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-red-200 to-pink-200 opacity-30 rounded-xl"></div>
            <div className="relative z-10 text-lg text-gray-700 break-words">
              <ReactMarkdown>{displayedAnswer}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbox;
