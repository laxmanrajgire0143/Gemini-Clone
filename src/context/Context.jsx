import { createContext } from "react";
import runChat from "../config/Gemini";
import { useState } from "react";

export const Context =createContext();


const ContextProvider = (props) => {

    const [input, setInput] = useState(""); // Initialize input state with an empty string
    const [recentPrompt, setRecentPrompt] = useState(""); // Initialize recentPrompt state with an empty string
    const [prevPrompts, setPrevPrompts] = useState([]); // Initialize prevPrompts state with an empty array
    const [showResult, setShowResult] = useState(false); // Initialize showResult state with false (assuming it controls visibility)
    const [loading, setLoading] = useState(false); // Initialize loading state with false
    const [resultData, setResultData] = useState("");

    const delayPara = (index,nextWord) =>{
        setTimeout(function (){
            setResultData(prev=>prev+nextWord);
        },75*index)
        
    }
 
    const handleInputChange = (event) => {
        setInput(event.target.value);
    };
    const onSent = async(prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(input)
      const response = await runChat(input);

    //   let responseArray = response.split("**");
    //   let newResponse;
    //   for(let i=0 ; i< responseArray.length; i++)
    //   {
    //     if(i === 0 || i%2 !== 1){
    //         newResponse += responseArray[i];
    //     }else{
    //         newResponse += "<br>"+responseArray[i]+"</br>";
    //     }
    //   }
    //   let newResponse2 = newResponse.split("*").join("</br>")

    //   setResultData(newResponse2)
    // async function processResponse(input) {
    //     // Update recent prompt
    //     setRecentPrompt(input);
    
    //     // Run chat function and get response
    //     const response = await runChat(input);
    
        // Split response by '**' delimiter
        let responseArray = response.split("**");
    
        // Initialize newResponse with an empty string
        let newResponse=" ";
    
        // Loop through the split array and format response
        for (let i = 0; i < responseArray.length; i++) {
            if (i % 2 === 0) {
                // Append text content
                newResponse += responseArray[i];
            } else {
                // Append <br> tag for odd indices
                newResponse +=  "<br>"+"<strong>" + responseArray[i] + "</strong>";
            }
        }
    
        // Replace '*' with <br> tag
        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length;i++)
        {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }
        
      setLoading(false)
      setInput("")
    }
    
   
    const contextvalue = {
       prevPrompts,
       setPrevPrompts,
       onSent,setRecentPrompt,
       recentPrompt,
       showResult,
       loading,
       resultData,setInput
    }
    return(
        <Context.Provider value={contextvalue}>
            {props.children}
        </Context.Provider>
    )

}

export default ContextProvider;
