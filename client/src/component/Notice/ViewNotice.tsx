import React, {useState, useEffect} from 'react';
import CommentBox from './Comment';
import ReadTable from './ReadTable';
import {data_format, default_value} from '../database';  //database
import '../../style/bootstrap.min.css';
import {getData} from './database_function';

const ViewNotice = ({match, history}) => {
    const[viewData, setState] = useState<data_format | null>(null)
    console.log(viewData)
    useEffect(()=>getData(match.params.id, setState), [])
    if(viewData === null) return <div>post isn't exist</div>
    else {
        return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <h1 className="mt-4">{viewData.title}</h1>
                        <p className="lead">by <a href="#">{viewData.sender}</a></p>
                        <hr/>
                        <p>Posted on {viewData.time}</p>
                        <hr/>
                        <div dangerouslySetInnerHTML={ { __html: viewData.content } }>
                        </div>
                        <hr/>
                        <CommentBox bbsid={match.params.id} reload={history}></CommentBox>
                    </div>
                    <div className="col-md-4">
                        <div className="card my-4">
                            <h5 className="card-header">Search</h5>
                            <div className="card-body">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search for..."/>
                                    <span className="input-group-btn">
                                    <button className="btn btn-secondary" type="button">Go!</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ReadTable bbsid={match.params.id} receiver={viewData.receiver}/>
                    </div>
                </div>
            </div>
            <footer className="py-5 bg-dark">
            <div className="container">
                <p className="m-0 text-center text-white">
                    Copyright © Your Website 2019
                </p>
            </div>
            </footer>
        </div>
)}}

export default ViewNotice;