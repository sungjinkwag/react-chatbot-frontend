import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  const sendMessage = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setConversation(prev => [...prev, { role: 'user', content: question }]);

    try {
      const res = await axios.post(`${API_BASE}/chat`, { query: question });
      const { answer, references } = res.data;

      setConversation(prev => [
        ...prev,
        //{ role: 'user', content: question },
        { role: 'bot', content: answer, sources: references }
      ]);
      setQuestion('');
    } catch (err) {
      alert('서버 연결 실패 😥');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 대화창 아래로 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '768px',
        margin: '0 auto',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>React Docs 챗봇</h2>

      <div
        style={{
          height: '60vh',
          overflowY: 'auto',
          marginBottom: '16px',
          padding: '12px',
          background: '#f9f9f9',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {conversation.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '90%',
              background: msg.role === 'user' ? '#d1eaff' : '#eeeeee',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '8px',
              fontSize: '14px',
              lineHeight: '1.4',
            }}
          >
            {msg.content}
            {msg.role === 'bot' && msg.sources && (
              <ul style={{ fontSize: '0.8em', marginTop: '6px', paddingLeft: '1em' }}>
                {msg.sources.map((s: any, idx: number) => (
                  <li key={idx}>
                    <a href={s.source} target="_blank" rel="noreferrer">
                      {s.source}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="질문을 입력하세요..."
          style={{
            flexGrow: 1,
            minWidth: 0,
            padding: '10px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 16px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            flexShrink: 0,
          }}
        >
          {loading ? '전송 중...' : '전송'}
        </button>
      </form>
    </div>
  );
}

export default App;
