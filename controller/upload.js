const pup = require("puppeteer");
const fs = require("fs");
//html string
const htmlCode = (port, name, file) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
    <title>Sug campaign affirmation</title>

    <style rel="stylesheet">
        * {
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Helvetica, sans-serif;
            color: #fff;
            background-image: url("http://localhost:${port}/images/protest.jpeg");
            background-size: contain;
            background-repeat: repeat-y;
        }

        main {
            background-image: linear-gradient(#041331f5, #3c715fe5);
            padding-bottom: 48px;
            height: 200vh;
        }

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }

        .nav {
            padding-top: 18px;
            padding-bottom: 18px;
        }

        .nav_img_cont {
            display: flex;
            justify-content: center;
        }

        .nav_img_cont img {
            height: 56px;
            width: 56px;
        }

        .header_cont {
            text-align: center;
        }

        #first_h {
            margin-bottom: 12px;
        }

        #second_h {
            margin-bottom: 12px;
        }

        .stud_week_banner {
            display: flex;
            justify-content: center;
            margin-top: 14px;
        }

        .stud_week_banner p {
            border: thin #fff solid;
            color: white;
            padding: 8px;
            border-radius: 4px;
            font-family: "Courier New", Courier, monospace;
            font-size: 1.3em;
        }

        .theme_cont {
            text-align: center;
            margin-top: 16px;
        }

        .campaign_img_cont {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
        }

        .img_cont {
            height: 280px;
            width: 280px;
            border-radius: 50%;
            border: 2px solid #fff;
            overflow: hidden;
            padding: 5px;
        }

        .s_n_c {
            margin-top: 12px;
        }

        .supporter_name {
            text-transform: uppercase;
            font-weight: bold;
        }

        .extras {
            display: flex;
            justify-content: center;
            margin-top: 12px;
        }

        .extras ul {
            margin-left: 80px;
        }

        .extras ul li {
            margin-top: 6px;
        }
    </style>
</head>

<body>
    <main>
        <div class="main_section">
            <div class="nav">
                <div class="nav_img_cont">
                    <img src="http://localhost:${port}/images/sug.png"
                        alt="sug logo" />
                    <img src="http://localhost:${port}/images/fupre.png"
                        alt="fupre logo" />
                </div>
            </div>
            <div class="main_header">
                <div class="header_cont">
                    <h2 id="first_h">STUDENT
                        UNION
                        GOVERNMENT FUPRE</h2>
                    <h2 id="#second_h">OFFICE
                        OF THE VICE
                        PRESIDENT</h2>
                </div>
                <div
                    class="stud_week_banner">
                    <p>STUDENT WEEK 20'</p>
                </div>
                <div class="theme_cont">
                    <h1>SAFE CAMPUS</h1>
                    <h1>INITIATIVE</h1>
                    <h1>CAMPAIGN</h1>
                </div>
                <div
                    class="campaign_img_cont">
                    <div class="img_cont">
                        <img src="http://localhost:${4500}/${file}"
                            class="supporter"
                            alt="supporter picture" />
                    </div>
                    <p class="s_n_c">I,<span
                            class="supporter_name">
                            ${name}</span>
                        stand against</p>
                </div>
                <div class="extras">
                    <ul>
                        <li>KILLINGS</li>
                        <li>SOCIAL VICES</li>
                        <li>VICTIMIZATION
                        </li>
                        <li>GENDER INEQUALITY
                        </li>
                        <li>CULTISM</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>
</body>

</html>`;
};
module.exports.uploader = async (req, res) => {
  const file = req.file;
  var imgPath = "";
  var ext = "";

  if (!file) {
    return res
      .status(401)
      .json({ code: 401, message: "file not found or file too large" });
  }
  if (file.mimetype == "image/png") {
    imgPath = file.path + ".png";
    ext = "png";
  } else if (file.mimetype == "image/jpeg") {
    imgPath = file.path + ".jpeg";
    ext = "jpeg";
  } else if (file.mimetype == "image/jpg") {
    imgPath = file.path + ".jpg";
    ext = "jpg";
  }
  var imgBuf = await generateFlyer(
    htmlCode(process.env.PORT || 4500, req.body.name, file.path)
  );
  const filePath = file.path;
  //res.set("Content-Type", `${file.mimetype}`);
  //return res.download("dom", imgBuf);
  res.json({ code: 200, buf: imgBuf, name: req.body.name, ext: ext });
  fs.unlink(filePath, (e) => {});
  //unlink image
};
//generate flyer
const generateFlyer = async (html) => {
  const browser = await pup.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.setViewport({
    height: 820,
    width: 820,
  });
  const content = await page.content();
  const imgBuf = await page.screenshot({
    omitBackground: false,
  });
  await page.close();
  await browser.close();
  return imgBuf;
};
