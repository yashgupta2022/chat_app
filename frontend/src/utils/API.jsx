import axios from 'axios';
import { port } from './io';

export const datetime = () => {
    try {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let d = new Date();
        let hrs = d.getHours();
        let min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
        let time = (hrs >= 12) ? ((hrs === 12) ? ('12:' + min + ' PM') : ((hrs - 12) + ':' + min + ' PM')) : ((hrs === 0) ? ('12:' + min + ' AM') : (hrs + ':' + min + ' AM'));
        const dt = days[d.getDay()] + ", " + d.getDate() + "/" + (d.getMonth() + 1) + "/" + (d.getFullYear() % 100) + ", " + time;
        return dt;
    } catch (error) {
        console.error('Error in datetime:', error);
        return '';
    }
}

export const getRoom = (item, userid) => {
    try {
        if (item?.type === 'individual') { return (userid.localeCompare(item.userid) === -1) ? (userid + item.userid) : (item.userid + userid); }
        else if (item?.type === 'group') { return item.username; }
        else { return ""; }
    } catch (error) {
        console.error('Error in getRoom:', error);
        return "";
    }
}

export const getName = async (user) => {
    try {
        const res = await axios.post(port + 'getName', { username: user });
        return res.data;
    } catch (error) {
        console.error('Error in getName:', error);
        return '';
    }
}

export const getfriendList = async (userid) => {
    try {
        var friendlist = [];
        var individualfriends = [];
        const response = await axios.post(port + 'friendList', { userid });
        if (response.data === 'Empty') {
            friendlist = [{ userid: '', username: "No Friends Added", type: '', room: '' }];
            individualfriends = [{ userid: '', username: "No Friends Added", type: '', room: '' }];
        } else {
            response.data.forEach(item => {
                if (item.type === 'individual') {
                    let obj = { userid: item.names[0].userid, username: item.names[0].username, type: item.type, room: item.room };
                    friendlist.push(obj);
                    individualfriends.push(obj);
                }
                else if (item.type === 'group') {
                    let obj = { userid: '', username: item.room, type: item.type, room: item.room };
                    friendlist.push(obj);
                }
            });
        }
        return { friendlist, individualfriends };
    } catch (error) {
        console.error('Error in getfriendList:', error);
        return { friendlist: [], individualfriends: [] };
    }
}

export const getMessages = async (room, userid) => {
    try {
        const obj = { userid, room };
        const response = await axios.post(port + 'showMsg', obj);
        if (response.data === 'FAIL') { return []; }
        return response.data;
    } catch (error) {
        console.error('Error in getMessages:', error);
        return [];
    }
}

export const getLastMessage = async (item, userid) => {
    try {
        if (item.username !== 'No Friend Added') {
            const obj = { room: item.room, userid };
            const response = await axios.post(port + 'lastMsg', obj);
            return response.data;
        }
        return {};
    } catch (error) {
        console.error('Error in getLastMessage:', error);
        return {};
    }
};

export const handleDPChange = async (e, item) => {
    try {
        const file = e.target.files[0];
        if (file) {
            if (['.jpg', '.png', '.jpeg'].some(i => file.name.includes(i))) {
                const data = new FormData();
                data.append('name', file.name)
                data.append('file', file)
                const response = await axios.post(port + 'uploadFile', data, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    }});
                const res = await axios.post(port + 'setDP', { userid: item.userid, username: item.username, type: item.type, dp: response.data });
                return response.data;
            } else {
                alert('Invalid Profile Picture Format... Acceptable formats (jpg, png)');
            }
        }
        return null;
    } catch (error) {
        console.error('Error in handleDPChange:', error);
        return null;
    }
}

export const fetchDP = async (item) => {
    try {
        const response = await axios.post(port + 'fetchDP', item);
        if (response.data !== 'NotFound') { return response.data; }
        else { return '/alt-dp.jpg'; }
    } catch (error) {
        console.error('Error in fetchDP:', error);
        return '/alt-dp.jpg';
    }
}

export const onlineUsers = (item, users) => {
    try {
        for (let user of users) {
            if (user.userid === item.userid) {
                return ('Online');
            }
        }
        return 'Offline';
    } catch (error) {
        console.error('Error in onlineUsers:', error);
        return 'Offline';
    }
}

export const getallfriends = async (room) => {
    try {
        const response = await axios.post(port + 'getGroupFriendList', { room: room });
        return response.data;
    } catch (error) {
        console.error('Error in getallfriends:', error);
        return [];
    }
}

export const getAllUsers = async () => {
    try {
        const res = await axios.get(port + 'getAllUsers');
        return res.data;
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return [];
    }
}

export const updateFriendList = async (userid, room) => {
    try {
        const res = await axios.post(port + 'updateFriendList', { userid, room });
    } catch (error) {
        console.error('Error in updateFriendList:', error);
    }
}
