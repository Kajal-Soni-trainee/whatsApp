const { Sequelize, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { users, contact_lists, groups, group_members, messages, group_msg } = require('../models');
const jwt = require('jsonwebtoken');
const registerUser = async (req, res) => {
    console.log(req.body);
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let phone = req.body.phone;
    try {
        let data = await users.create({
            fname: fname,
            lname: lname,
            email: email,
            phone: phone
        });
        console.log(data);
        res.json("users register successfully");
    } catch (err) {
        console.log(err);
        res.json(err);
    }
}

const createPass = async (req, res) => {
    let email = req.body.email;
    let pass = req.body.pass;
    let salt = await bcrypt.genSalt(10);

    let password = await bcrypt.hash(pass, salt);
    try {
        let rows = await users.findAll({
            where: {
                email: email
            },
            raw: true
        });
        let len = rows.length;
        if (len == 1) {
            let data = await users.update({
                password: password,
                salt: salt
            }, {
                where: {
                    email: email
                }
            });
            res.json("password created successfully");
        } else {
            res.json("invalid password");
        }
    } catch (err) {
        console.log(err)
    }
}

const loginUser = async (req, res) => {
    let email = req.body.email;
    let pass = req.body.pass;
    try {
        let data = await users.findAll(
            {
                where: {
                    email: email
                }
            }
        )
        let len = data.length;
        if (len == 1) {
            let dbsalt = data[0].salt;
            let dbpass = data[0].password;
            let password = await bcrypt.hash(pass, dbsalt);
            if (dbpass == password) {
                let payloads = { id: data[0].id, email: data[0].email };
                let token = jwt.sign(payloads, process.env.SECRET_KEY);
                res.cookie('token', token,
                    {
                        httpOnly: true,
                        maxAge: 60 * 60 * 2 * 1000
                    }
                )
                res.json("user logged in successfully")
            } else {
                res.json("invalid credential");
            }
        } else {
            res.json("invalid credentail");
        }
    } catch (err) {
        console.log(err);
    }
}

const addToContactList = async (req, res) => {
    let user_id = req.user[0].id;
    console.log(req.user);
    let phone = req.body.phone;
    let name = req.body.name;
    try {
        let result = await users.findAll({
            where: {
                phone: phone
            },
            raw: true
        });
        let len = result.length;
        if (len == 1) {
            let contact_person_id = result[0].id;
            try {
                let data = await contact_lists.create({
                    contact_id: user_id,
                    contact_person_id: contact_person_id,
                    contact_person_name: name
                });
                console.log(data);
                res.json("user added to your contact list");
            } catch (err) {
                console.log(err)
            }
        }
    } catch (err) {
        console.log(err);
    }
}

const createGroup = async (req, res) => {
    let name = req.body.name;
    let user_id = req.user[0].id;
    try {
        let data = await groups.create({
            group_name: name,
            created_by: user_id
        });
        res.json("group has been created successfully");
    }
    catch (err) {
        console.log(err);
    }
}

const addMembers = async (req, res) => {
    let group_id = req.body.group_id;
    let members_id = req.body.members_id.split(',');
    console.log(members_id);
    try {
        members_id.forEach(async element => {
            try {
                let data = await group_members.create({
                    group_id: group_id,
                    member_id: element
                })
            } catch (err) {
                console.log(err)
            }
        });
        res.json("members added succesfully");
    } catch (err) {
        console.log(err)
    }
}


const sendMsg = async (req, res) => {
    let msg = req.body.msg;
    let receiver_id = req.body.receiver_id;
    let user_id = req.user[0].id;
    try {
        let data = await messages.create({
            msg_txt: msg,
            sender_id: user_id,
            receiver_id: receiver_id
        })
        res.json("message sent successfully");
    } catch (err) {
        console.log(err)
    }
}

const sendGroupMsg = async (req, res) => {
    let group_id = req.body.group_id;
    let msg = req.body.msg;
    let user_id = req.user[0].id;
    console.log("user_id", user_id);
    console.log('group_id', group_id);
    try {
        let data = await group_msg.create({
            group_id: group_id,
            sender_id: user_id,
            msg_txt: msg
        });
        res.json("message send successfully");
    } catch (err) {
        console.log(err)
    }
}

const deleteForMeMsg = async (req, res) => {
    let user_id = req.user[0].id;
    let msg_id = req.query.id;
    try {
        let data = await messages.update({ deletedBy: user_id }, {
            where: {
                id: msg_id
            }
        })
    } catch (err) {
        console.log(err)
    }
}


const showContactList = async (req, res) => {
    let user_id = req.user[0].id;
    try {
        let data = await contact_lists.findAll({
            attributes: ['user.fname', 'user.lname', 'user.phone', 'user.id', 'user.email', 'contact_person_name'],
            include: {

                model: users,
                required: true,
                attributes: []
            },
            where: {
                contact_id: user_id,
                isBlocked: null
            },
            raw: true,
        });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
}

const showAllMsg = async (req, res) => {
    let user_id = req.user[0].id;
    let receiver_id = req.query.id;
    try {
        let data = await messages.update({
            isSeen: 1,
        }, {
            where: {
                sender_id: receiver_id,
                receiver_id: user_id,
                deleted_by: {
                    [Op.ne]: [user_id]
                }
            }
        })
    } catch (err) {
        console.log(err)
    }
    try {
        let result = await messages.findAll({
            where: {
                sender_id: {
                    [Op.or]: [user_id, receiver_id]
                },
                receiver_id: {
                    [Op.or]: [user_id, receiver_id]
                }
            }
        });
        res.json(result);
    } catch (err) {
        console.log(err);
    }
}

const showGroupMsg = async (req, res) => {
    let user_id = req.user[0].id;
    let group_id = req.query.id;

    try {
        let result = await group_msg.findAll({
            where: {
                group_id: group_id,
                deleted_by: {
                    [Op.ne]: [user_id]
                }
            },
            raw: true
        })
        res.json(result);

    } catch (err) {
        console.log(err)
    }
}

const deleteforMeGroupMsg = async (req, res) => {
    let msg_id = req.body.msg_id;
    let deletedBy = req.user[0].id;
    try {
        let data = await group_msg.update({
            deleted_by: deletedBy
        }, {
            where: {
                id: msg_id
            }
        }
        )
        res.json("message has been deleted");
    } catch (err) {
        console.log(err)
    }
}

const deleteMsgForAll = async (req, res) => {
    let msg_id = req.body.msg_id;
    let user_id = req.user[0].id;
    try {
        let data = await messages.update({
            deleted_by: user_id
        },
            {
                where: {
                    id: msg_id
                }
            })
        try {
            let deletemsg = await messages.destroy({
                where: {
                    id: msg_id
                }
            })
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
}

const deleteGrpMsgForAll = async (req, res) => {
    let msg_id = req.body.msg_id;
    let user_id = req.user[0].id;
    try {
        let data = await group_msg.update({
            deleted_by: user_id
        },
            {
                where: {
                    id: msg_id
                }
            })
        try {
            let deletemsg = await group_msg.destroy({
                where: {
                    id: msg_id
                }
            })
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
}

const setStatus = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
}


module.exports = { registerUser, createPass, loginUser, addToContactList, createGroup, addMembers, sendMsg, sendGroupMsg, deleteForMeMsg, showContactList, showAllMsg, showGroupMsg, deleteforMeGroupMsg, deleteMsgForAll, deleteGrpMsgForAll, setStatus }
