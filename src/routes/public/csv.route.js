import { Router } from "express";
import UserService from "../../services/user.service.js";

const router = Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });
router.post("/save", async (req, res, next) => {
  try {
    const result = await UserService.saveUser(req);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/import-csv", async (req, res, next) => {
  try {
    const result = await UserService.saveCsv(req);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/reports", async(req, res)=>{
  try{
   const result = await UserService.generateReport();
    res.status(200).send(result)
  } catch (err){
    res.status(500).send(err);
  }
})

export default router;
