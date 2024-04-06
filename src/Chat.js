import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import ReactMarkdown from 'react-markdown';
import Card from './components/Card'
import styles from './Chat.module.css';


export default  function Chat(){


    let previousHistory=[]
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [sourceDocs, setSourceDocs] = useState([]);
    const [error, setError] = useState(null);

    const [messageState, setMessageState] = useState({
        messages: [
        
        ],
        history: previousHistory,
        pendingSourceDocs: [],
    });

    const { messages, pending, history, pendingSourceDocs } = messageState;


    async function handleSubmit(e) {
        e.preventDefault();
    
    
        if (!query) {
          alert('请输入问题');
          return;
        }
    
        const question = query.trim();
    
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'userMessage',
              message: question,
            },
          ],
          pending: undefined,
        }));
    
        setQuery('');
        setMessageState((state) => ({ ...state, pending: '' }));
    
        const ctrl = new AbortController();
    
    
        fetchEventSource(`http://${process.env.REACT_APP_BASE_URL}:8090/api/gpt/chat-gpt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question,
                history,
            }),
            signal: ctrl.signal,
            onmessage: (event) => {
                if (event.data === '[DONE]') {
                
                    setMessageState((state) => ({
                        history: [...state.history, [question, state.pending ?? '']],
                        messages: [
                        ...state.messages,
                        {
                            type: 'apiMessage',
                            message: state.pending ?? '',
                            sourceDocs: state.pendingSourceDocs,
                        },
                        ],
                        pending: undefined,
                        pendingSourceDocs: undefined,
                    }));

                    setLoading(false);

                    ctrl.abort();

                } else {
                    const data = JSON.parse(event.data);
                    if (data.sourceDocs) {
                        setMessageState((state) => ({
                        ...state,
                        pendingSourceDocs: data.sourceDocs,
                        }));
                    } else {
                        setMessageState((state) => ({
                        ...state,
                        pending: (state.pending ?? '') + data.data,
                        }));
                    }
                }
            },
        });
        
    }
    const handleEnter = useCallback(
        (e) => {
          if (e.key === 'Enter' && query) {
            handleSubmit(e);
          } else if (e.key == 'Enter') {
            e.preventDefault();
          }
        },
        [query],
    );

    const chatMessages = useMemo(() => {
        return [
          ...messages,
          ...(pending
            ? [
                {
                  type: 'apiMessage',
                  message: pending,
                  sourceDocs: pendingSourceDocs,
                },
              ]
            : []),
        ];
      }, [messages, pending, pendingSourceDocs]);

    useEffect(()=>{
        fetch(`http://${process.env.REACT_APP_BASE_URL}:8090/api/gpt/find-gpt`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            
            })
        })
        .then(data=>data.json())
        .then(json=>{
                        
            json.Gpts.forEach(history=>previousHistory.unshift([history.question,history.response.text]))
            setMessageState({
                ...messageState,
                history:previousHistory
            })
    
            console.log(messageState)
        })
    },[])
                 
    return (
        <>
            <div className={styles.flex}>
                <h2>BMG Market Sniffer</h2>

                <form onSubmit={handleSubmit} className={styles.flex}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    autoFocus={false}
                    rows={1}
                    maxLength={512}
                    id="userInput"
                    name="userInput"
                    placeholder={
                      loading
                        ? '等待加载...'
                        : 'Input your question'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.textarea}
                  />
                  <button
                    type="submit"                    
                    className={styles.button}
                  >
                    Search
                  </button>
                </form>

                {chatMessages
                    .slice(0)
                    .reverse()
                    .map((message, index) => {
                 console.log(chatMessages)
                  return (
                    <>
                      <div key={`chatMessage-${index}`} className={null}>
                        <div className={styles.markdownanswer}>
                          <ReactMarkdown linkTarget="_blank">
                            {message.message}
                          </ReactMarkdown>
                        </div>
                      </div>
                      
                    </>
                  );
                })}
                {messageState.history.map(history=>(
                    <Card question={history[0]} answer={history[1]}/>
                ))}
            </div>        
        </>

    )
}