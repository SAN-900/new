const { Router } = require("express");
const { Admin, User, Course } = require("../db");
const userMiddleware = require("../middleware/user");
const router = Router();

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username,
        password
    })
    res.json({
        msg: "user created successfully."
    })
})
router.post('/courses/:courseId',userMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.headers.username;
    await User.updateOne({
        username: username
    },
{
    "$push": {
        purchasedCourses: courseId
    }
})
res.json({
    msg: "purchased successfully."
})
})
router.get('/courses', async (req, res) => {
    const response = await Course.find({});

    res.json({
        courses: response
    })
});
router.get('/purchasedCourses',userMiddleware, async (req, res) => {
    const user = await User.findOne({
        username: req.headers.username
    });

    console.log(user.purchasedCourses);
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });

    res.json({
        courses: courses
    })
});

module.exports = router;