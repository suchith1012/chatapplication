let friendsocket=[];

const addinglist = async(data)=>{
   const list = data;
   //console.log("--------",list.length)
 for (let i=0;i<list.length;i++){
     friendsocket.push(list[i].socket_name)
}
//console.log(friendsocket)
};

const getlistsocket = async()=>{
    const listtttt =friendsocket
if(listtttt==[]){
    return [];
}
else{
    return listtttt
}
};

export {addinglist,getlistsocket};