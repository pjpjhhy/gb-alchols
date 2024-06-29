export const mainPage = (req,res) =>{
  return res.render("index",req.user)
};
export const detailPage = (req,res) => res.render("detailPage");
export const mapPage = (req,res) => res.render("map");
export const myPage = (req,res) =>{
  return res.render("myPage",req.user)
};
export const stampPage = (req,res) => res.render("stampPage");
export const qrPage = (req,res) => res.render("qrPage");
export const login = (req,res) => res.render("login");
export const sign = (req,res) => res.render("sign");

export const guide = (req,res) => res.render("guide");