import { Router } from 'express';

const router = Router();
router.get('/', (req, res, next) => {
    console.log("thisi s owkirngggggg hererer")
    res.status(200).send({
        status: 200,
        message: "Server is up and running............."
    });

});

export default router;
