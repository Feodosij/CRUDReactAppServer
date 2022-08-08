import Card from "../models/CardModel.js";
import path from "path";
import fs from "fs";


export const getCard = async(req, res)=>{
    try {
        const response = await Card.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getCardById = async(req, res)=>{
    try {
        const response = await Card.findOne({
            where:{
                id : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}


export const saveCard = (req, res) => {
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.title;
    const real_name = req.body.real_name;
    const origin_description = req.body.origin_description;
    const superpowers = req.body.superpowers;
    const catch_phrase = req.body.catch_phrase;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Card.create({name: name, real_name: real_name, origin_description: origin_description, superpowers: superpowers, catch_phrase: catch_phrase, image: fileName, url: url});
            res.status(201).json({msg: "Card Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })
}

export const updateCard = async(req, res) => {
    const card = await Card.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!card) return res.status(404).json({msg: "No Data Found"});

    let fileName = "";
    if(req.files === null){
        fileName = card.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/${card.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
            
        })

    }

    const name = req.body.title;
    const real_name = req.body.real_name;
    const origin_description = req.body.origin_description;
    const superpowers = req.body.superpowers;
    const catch_phrase = req.body.catch_phrase;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await Card.update({name: name, image: fileName, url: url, real_name: real_name, origin_description: origin_description, superpowers: superpowers, catch_phrase: catch_phrase},{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Card Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }

}

export const deleteCard = async(req, res) => {
    const card = await Card.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!card) return res.status(404).json({msg: "No Data Found"});

    try {
        const filepath = `./public/images/${card.image}`;
        fs.unlinkSync(filepath);
        await Card.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Card Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}