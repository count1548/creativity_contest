import React, {useState, useEffect, ChangeEvent, FormEvent} from 'react';
import {setCommentData, getCommentData} from './database_function';
import {commentFormat} from '../database';

const Comment = ({_data, replyFunction}) => {
    var attr, replyTarget
    if(_data.parent_id !=null) {
        attr = "m-left"
        replyTarget = _data.parent_id
    }
    else {
        attr = ""
        replyTarget = _data.id
    }
    return (
    <div className = {`media mb-4 ${attr}`}>
        <img className="d-flex mr-3 rounded-circle" 
            src="http://placehold.it/50x50" alt="" 
            onClick={() => {replyFunction(replyTarget)}}/>
        <div className="media-body">
        <div className='top-box'>
            <h5 className="uname mt-0">{_data.name}</h5>
            <span className='time'>{_data.time}</span>
        </div>
            <span className='dcontent'>{_data.content}</span>
        </div>
    </div>
)}

const defaultValue = {
    bbs_id : null,
    name : '관리자',
    content : '', time :  new Date().toISOString().split(".")[0],
    parent_id : null,
    id : -1
}

const CommentBox = ({bbsid, reload}) => {
    const [data, setState] = useState<commentFormat[] | null>(null)
    useEffect(()=> getCommentData(bbsid, setState), [])
    const[newComment, setComment] = useState({
        ...defaultValue,
        bbs_id : bbsid
    });
    const onChange = (e:  ChangeEvent<HTMLInputElement> | 
            ChangeEvent<HTMLTextAreaElement> |
            ChangeEvent<HTMLSelectElement>) => {
        setComment({
            ...newComment,
            [e.target.name] : e.target.value
        });
    }
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCommentData(newComment, setState)
        setComment({...defaultValue, bbs_id:bbsid})
    }
    const changeParent = (id) => { setComment({...newComment, parent_id : id}) }
    if(data == null) return <div>loading...</div>
    else {
        //console.log(data)
        return (
            <div>
                <div className="card my-4">
                    <h5 className="card-header">Leave a Comment:</h5>
                    <div className="card-body">
                    <form action='/setComment' onSubmit={onSubmit}>
                        <div className="form-group">
                        <textarea name='content' className="form-control" style={{height:100}} onChange={onChange}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    </div>
                </div>
                {data.map((value, idx) => (
                    <Comment _data = {value} replyFunction={changeParent} key={idx}></Comment>
                ))}
            </div>
)}}
export default CommentBox;