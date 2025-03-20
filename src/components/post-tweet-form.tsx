import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";


const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    &::placeholder{
        font-size: 16px;
        font-familyy: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
            sans-serif;
    }
    &:focus {
        outline: none;
        border-color: #1d9bf0;
    }
`;

const AttachFileButton = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer; 
`;

const AttachFileInput = styled.input`
    display: none;
`;

const SubmitBtn = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 15px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
`;

export default function PostTweetForm(){
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    // const [file, setFile] = useState<File | null>(null);
    const [file, setFile] = useState<string | null>(null);


    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };

    // --- Raw file
    // const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const {files} = e.target;
    //     if(files && files.length === 1){
    //         setFile(files[0])
    //     }
    // }

    // --- Base 64 Encoding
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(files && files.length === 1){
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result as string);
            };
            reader.readAsDataURL(files[0]);
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;

        if(isLoading || tweet === "" || tweet.length > 180) return;

        try{
            setLoading(true);
            await addDoc(collection(db, "tweets"), {
                tweet,
                createdAt: Date.now(),
                username: user?.displayName || "Anonymous",
                userId: user?.uid,
                photo: file
            })

            setTweet("")
            setFile(null)
            // if(file){
            //     const locationRef = ref(storage, `tweets/${user?.uid}-${user?.displayName}/${doc.id}`)
            //     await uploadBytes(locationRef, file)
            // }

        }catch(e){
            console.log(e);
        }finally{
            setLoading(false);
        }
    }

    return <Form onSubmit={onSubmit}>
        <TextArea rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happening?" required/>
        <AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add photo"}</AttachFileButton>
        <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
        <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post tweet"} />
    </Form>
}