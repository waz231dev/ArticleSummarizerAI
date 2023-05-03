import { copy, linkIcon, loader, tick } from "../assets"
import { useEffect, useState } from "react"
import axios from "axios";

const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY;
const Demo = () => {
    const [article, setArticle] = useState({
        url:'',
        summary:''
    });
    const [allArticles, setAllArticles] = useState([])
    const [isLoading, setIsLoading] = useState(null);
    const [copied,setCopied] = useState("")
    useEffect(()=>{
        const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles')
        )
        
        if(articlesFromLocalStorage){
            setAllArticles(articlesFromLocalStorage)
        }
},[]);
    const fetchData = async()=>{
        const options = {
            method: 'GET',
            url: 'https://article-extractor-and-summarizer.p.rapidapi.com/summarize',
            params: {
              url: article.url,
              length: '3'
            },
            headers: {
              'X-RapidAPI-Key': rapidApiKey,
              'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com'
            }
        };
          
        try {
            const response = await axios.request(options);
            const {summary} = response.data;
            return summary;
        } catch (error) {
            console.error(error);
        }
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        const summary = await fetchData();
        setIsLoading(false);
        if(summary){
            const newArticle = {...article,summary:summary};
            const updatedAllArticles = [newArticle,...allArticles]
            
            setArticle(newArticle);
            setAllArticles(updatedAllArticles);
            
            localStorage.setItem('articles',JSON.stringify(updatedAllArticles))
        }
    }

    const handleCopy = (copyUrl)=>{
        setCopied(copyUrl);
        navigator.clipboard.writeText(copyUrl);
        setTimeout(()=>setCopied(false),3000);
    }
  return (
    <section className="mt-16 w-full max-w-xl">
        {/* Search */}
        <div className="flex flex-col w-full gap-2">
            <form
                className="relative flex justify-center items-center" 
                onSubmit={handleSubmit}
            >
                <img
                    src={linkIcon}
                    alt="link_icon"
                    className="absolute left-0 my-2 ml-3 w-5"
                />
                <input
                    type="url"
                    placeholder="Enter a URL"
                    required
                    value={article.url}
                    onChange={(e)=>setArticle({...article,url:e.target.value})}
                    className="url_input peer"
                />
                <button
                 type="submit"
                 className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
                >
                    ↲
                </button>
            </form>
            {/* Browse URL History */}
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                {allArticles.slice(0,10).map((item,index) =>{
                    return (
                        <div key = {`link-${index}`}
                            onClick={()=>setArticle(item)}
                            className="link_card"
                        >
                            <div className="copy_btn" onClick={()=>handleCopy(item.url)}>
                                <img
                                    src = {copied === item.url ? tick : copy}
                                    alt="copy-icon"
                                    className="w-[40%] h-[40%] object-contain"
                                />
                            </div>
                            <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                                {item.url}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
        
        {/* Display Results */}
        <div className="my-10 max-w-full flex justify-center items-center">
           {isLoading ? (
                <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
           ) : (
                article.summary && (
                    <div className="flex flex-col gap-3">
                        <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                            Article <span className="blue_gradient">Summary</span>
                        </h2>
                        <div className="summary_box">
                            <p className="font-inter font-medium text-sm text-gray-700">{article.summary}</p>
                        </div>
                    </div>
                )
           )} 
        </div>
    </section>
  )
}

export default Demo