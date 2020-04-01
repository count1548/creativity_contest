export interface data_format {
  id : number,    //식별 id
  title : string, //제목
  sender : string,  //보낸사람
  receiver : string,  //대상 그룹
  read_num : number,  //읽은인원
  comment_num : number, //댓글 수
  file : string | null,  //첨부
  time : string,  //시간
  content : string,   //내용
}

export interface commentFormat {
    bbs_id : number,
    name : string,
    content : string,
    time : string,
    parent_id : number | null,
    id : number,
}

export const default_value : data_format = {
  id : 0, title : '', sender : '관리자', receiver : '학생처', 
  read_num : 0, comment_num:0,
  file : null, time : '', content : ''
}

const localData : data_format [] = [
    {
      id : 1,
      title : "컴퓨터정보공학부 공지사항",
      sender : "관리자",
      receiver : "컴퓨터정보공학부(300)",
      read_num : 3,
      comment_num : 1,
      file : null,
      time : "2016-11-08T18:00:00",
      content : "<p className='lead'> \
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?\
      </p><p>\
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, nostrum, aliquid, animi, ut quas placeat totam sunt tempora commodi nihil ullam alias modi dicta saepe minima ab quo voluptatem obcaecati?\
      </p><p>\
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis. Sunt, ut, explicabo, aliquam tenetur ratione tempore quidem voluptates cupiditate voluptas illo saepe quaerat numquam recusandae? Qui, necessitatibus, est!\
      </p>", 
    },
    {
      id : 2,
      title : "튜터링 공지사항",
      sender : "관리자",
      receiver : "컴퓨터정보공학부(300)",
      read_num : 111, 
      comment_num : 201,
      file : null,
      time : "2016-12-08T18:00:00",
      content : "<p className='lead'> \
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?\
      </p><p>\
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, nostrum, aliquid, animi, ut quas placeat totam sunt tempora commodi nihil ullam alias modi dicta saepe minima ab quo voluptatem obcaecati?\
      </p><p>\
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis. Sunt, ut, explicabo, aliquam tenetur ratione tempore quidem voluptates cupiditate voluptas illo saepe quaerat numquam recusandae? Qui, necessitatibus, est!\
      </p>", 
    },
    {
      id : 3,
      title : "봉사활동 관련 공지사항",
      sender : "관리자",
      receiver : "AI융합대학(200)",
      read_num : 120, 
      comment_num : 12,
      file : null,
      time : "2016-11-08T18:00:00",
      content : "<p className='lead'> \
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?\
      </p><p>\
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, nostrum, aliquid, animi, ut quas placeat totam sunt tempora commodi nihil ullam alias modi dicta saepe minima ab quo voluptatem obcaecati?\
      </p><p>\
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum, dolor quis. Sunt, ut, explicabo, aliquam tenetur ratione tempore quidem voluptates cupiditate voluptas illo saepe quaerat numquam recusandae? Qui, necessitatibus, est!\
      </p>", 
    },
  ];
  
  export default localData;
  