import React, {useState, ChangeEvent, FormEvent} from 'react';
import { default_value } from '../database';
import '../../style/new_post.css';
import {setData} from './database_function';


const NewNotice = ({history}) => {
    const [newData , setState]= useState({...default_value,
      time : new Date().toISOString().split(".")[0],})
    const onChange = (e:  ChangeEvent<HTMLInputElement> | 
                          ChangeEvent<HTMLTextAreaElement> |
                          ChangeEvent<HTMLSelectElement>) => {
      setState({
        ...newData,
        [e.target.name] : e.target.value
      });      
    }
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setData(newData);
      //push data to server
      history.push("/notice");
    }

    return (
        <div className="main">
            <h2>New Post</h2>
            <div className="_container">
                <form action="/ApplyNewNotice" onSubmit={onSubmit}>
                    <div className="_row">
                      <div className="col-25">
                          <label htmlFor="title">Title</label>
                      </div>
                      <div className="col-75">
                          <input type="text" 
                            id="title" 
                            name="title" 
                            placeholder="INPUT TITLE"
                            onChange={onChange}/>
                      </div>
                    </div>                    
                    <div className="_row">
                      <div className="col-25">
                          <label htmlFor="receiver">Receiver</label>
                      </div>
                      <div className="col-75">
                          <select 
                            id="receiver" 
                            name="receiver"
                            onChange={onChange}>
                            >
                          <option value="컴퓨터정보공학부">컴퓨터정보공학부</option>
                          <option value="학생처" selected>학생처</option>
                          <option value="예술대학">예술대학</option>
                          </select>
                      </div>
                    </div>
                    <div className="_row">
                      <div className="col-25">
                          <label htmlFor="receiver"></label>
                      </div>
                      </div>
                      <div className="_row">
                      <div className="col-25">
                          <label htmlFor="content">Content</label>
                      </div>
                      <div className="col-75">
                          <textarea 
                            id="content" 
                            name="content" 
                            placeholder="Write something.." 
                            style={{height:200}}
                            onChange={onChange}>
                            </textarea>
                      </div>
                    </div>
                    <div className="_row">
                    <input type="submit" value="Submit"/>
                    </div>
                </form>
            </div>
        </div>
    )
} 

export default NewNotice;