const {createCanvas, loadImage, Image} = require("canvas");
const fs = require("fs");

const infoMap = new Map([
    ['Organization', [105.2, 825, 300]],
    ['Email', [105.2, 873, 300]],
    ['Website', [105.2, 921, 300]],
    ['Phone', [460, 825, 300]],
    ['Location', [460, 873, 300]],
    ['AreaOfInterest', [460, 921, 300]]
]);

function setShadowSettings(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
}

function applyShadowEffect(ctx) {
    ctx.shadowColor = "#000000";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
}

function createBlackAndWhiteImage(sourceImage) {
    const canvas = createCanvas(sourceImage.width, sourceImage.height);
    const ctx = canvas.getContext("2d");
    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;

    // Draw the image onto the canvas
    ctx.drawImage(sourceImage, 0, 0);

    // Apply black and white (desaturation) filter
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

        // Increase contrast for dark areas, decrease contrast for light areas
        const intensityDiff = avg - 128;
        const contrastFactor = 1 + (intensityDiff / 128) * 0.2; // Adjust the multiplication factor for stronger effect

        // Apply the contrast adjustment to each channel
        const contrastRed = Math.min(255, Math.max(0, data[i] * contrastFactor));
        const contrastGreen = Math.min(255, Math.max(0, data[i + 1] * contrastFactor));
        const contrastBlue = Math.min(255, Math.max(0, data[i + 2] * contrastFactor));

        // Convert to grayscale using luminance formula
        const grayValue = 0.299 * contrastRed + 0.587 * contrastGreen + 0.114 * contrastBlue;

        // Set all color channels to the grayscale value
        data[i] = data[i + 1] = data[i + 2] = grayValue;

    }
    ctx.putImageData(imageData, 0, 0);

    const blackAndWhiteImage = new Image();
    blackAndWhiteImage.src = canvas.toDataURL();
    return blackAndWhiteImage;
}

function extractLines(words, currentLine, ctx, textWidth, lines) {
    for (let i = 1; i < words.length; i++) {
        const testLine = `${currentLine} ${words[i]}`;
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth <= textWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
}

function drawEachLine(lines, textX, textY, lineHeight, ctx) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const textXPosition = textX;
        const textYPosition = textY + i * lineHeight;

        ctx.fillText(line, textXPosition, textYPosition);
    }
}

function writeName(ctx, shortName, textWidth, textX, textY) {
    const textColor = '#FFFFFF';
    const fontSize = 42;
    const lineHeight = 38;
    const textAlign = 'left';
    applyShadowEffect(ctx);
    ctx.font = `${fontSize}px Barlow, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    ctx.textAlign = textAlign;
    const words = shortName.split(' ');
    let lines = [];
    let currentLine = words[0];
    extractLines(words, currentLine, ctx, textWidth, lines);
    drawEachLine(lines, textX, textY, lineHeight, ctx);
    setShadowSettings(ctx);
}

async function writeShortName(ctx, shortName) {
    const textX = 46;
    const textY = 261;
    const textWidth = 294;
    writeName(ctx, shortName, textWidth, textX, textY);
}

async function writeLongName(ctx, longName) {
    const textX = 56;
    const textY = 228;
    const textWidth = 279.17;
    writeName(ctx, longName, textWidth, textX, textY)
}

async function writeShortNameDesignation(ctx, text) {

    // Text specifications
    const textX = 52;
    const textY = 332;
    const textWidth = 250;
    const textColor = '#FFFFFF';
    const fontSize = 24;
    const fontWeight = '400';
    const lineHeight = 29;
    const textAlign = 'left';

    // Apply drop shadow effect
    applyShadowEffect(ctx);

    // Set text properties
    ctx.font = `${fontWeight} ${fontSize}px Barlow, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    ctx.textAlign = textAlign;

    // Split text into multiple lines if needed
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    extractLines(words, currentLine, ctx, textWidth, lines);
    drawEachLine(lines, textX, textY, lineHeight, ctx);
    setShadowSettings(ctx);
}

async function writeLongNameDesignation(ctx, designation) {

    // Text specifications
    const textX = 62;
    const textY = 332;
    const textWidth = 279.17;
    const fontFamily = 'Barlow';
    const fontSize = 24;
    const fontWeight = '400';
    const lineHeight = 29;
    const textAlign = 'left';
    const textColor = '#FFFFFF';

    // Apply drop shadow effect
    applyShadowEffect(ctx);

    // Set designation properties
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    ctx.textAlign = textAlign;

    // Split designation into multiple lines if needed
    const words = designation.split(' ');
    let lines = [];
    let currentLine = words[0];

    extractLines(words, currentLine, ctx, textWidth, lines);
    drawEachLine(lines, textX, textY, lineHeight, ctx);

    // Remove shadow settings for other drawings
    setShadowSettings(ctx);
}

function setNameAndDesignation(name, ctx, designation) {

    if (designation.length <= 21) {
        designation = designation + ',' + ' '.repeat(22 - designation.length) + company;
    } else {
        designation = designation + ',';
    }

    if (name.length <= 11) {
        name = name + ' '.repeat(11 - name.length);
        writeShortName(ctx, name);
        writeShortNameDesignation(ctx, designation);
    } else {
        writeLongName(ctx, name);
        writeLongNameDesignation(ctx, designation);
    }
}

async function writeAboutMe(aboutText, ctx) {
    const textX = 52;
    const textY = 612;
    const textWidth = 634;
    const lineHeight = 34;
    const fontSize = 28;
    const fontWeight = '400';
    const textAlign = 'left';
    const textColor = '#112D44';

    // Set text properties
    ctx.font = `${fontWeight} ${fontSize}px Barlow, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    ctx.textAlign = textAlign;

    const words = aboutText.split(' ');
    let lines = [];
    let currentLine = words[0];

    extractLines(words, currentLine, ctx, textWidth, lines);
    drawEachLine(lines, textX, textY, lineHeight, ctx);
}

async function setImageOnTemplate(ctx, overlayImagePath) {
    const imageX = 374;
    const imageY = 188;
    const imageWidth = 324;
    const imageHeight = 324;
    const cornerRadius = 35.64;

    const overlayImage = await loadImage(overlayImagePath);

    // Create a clipping path
    ctx.beginPath();
    ctx.moveTo(imageX + cornerRadius, imageY);
    ctx.lineTo(imageX + imageWidth - cornerRadius, imageY);
    ctx.quadraticCurveTo(imageX + imageWidth, imageY, imageX + imageWidth, imageY + cornerRadius);
    ctx.lineTo(imageX + imageWidth, imageY + imageHeight - cornerRadius);
    ctx.quadraticCurveTo(imageX + imageWidth, imageY + imageHeight, imageX + imageWidth - cornerRadius, imageY + imageHeight);
    ctx.lineTo(imageX + cornerRadius, imageY + imageHeight);
    ctx.quadraticCurveTo(imageX, imageY + imageHeight, imageX, imageY + imageHeight - cornerRadius);
    ctx.lineTo(imageX, imageY + cornerRadius);
    ctx.quadraticCurveTo(imageX, imageY, imageX + cornerRadius, imageY);
    ctx.closePath();

    ctx.clip();
    applyShadowEffect(ctx);

    const grayscaleOverlay = createBlackAndWhiteImage(overlayImage);
    ctx.drawImage(
        grayscaleOverlay,
        imageX,
        imageY,
        imageWidth,
        imageHeight
    );
    setShadowSettings(ctx);
}

function detailWriter(field, ctx, lineHeight, textSpecifications) {

    const textX = textSpecifications[0];
    const textY = textSpecifications[1];
    const textWidth = textSpecifications[2];

    const words = field.split(' ');
    let lines = [];
    let currentLine = words[0];

    extractLines(words, currentLine, ctx, textWidth, lines);

    // Draw each line of field
    drawEachLine(lines, textX, textY, lineHeight, ctx);
}

async function setDetails(name, designation, aboutText, overlayImagePath, templateImagePath, organizationName, outputPath, emailId, webUrl, phone, location, areaOfInterest) {
    const canvasWidth = 736;
    const canvasHeight = 1104;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    const templateImage = await loadImage(templateImagePath);

    ctx.drawImage(templateImage, 0, 0);

    setNameAndDesignation(name, ctx, designation);
    writeAboutMe(aboutText, ctx);

    const fontFamily = 'Barlow';
    const fontSize = 22;
    const fontWeight = '500';
    const lineHeight = 26;
    const textAlign = 'left';
    const textColor = '#112D44';

    // Set text properties
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}, Barlow, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    ctx.textAlign = textAlign;

    setImageOnTemplate(ctx, overlayImagePath);

    detailWriter(emailId, ctx, lineHeight, infoMap.get('Email'));
    detailWriter(organizationName, ctx, lineHeight, infoMap.get('Organization'));
    detailWriter(webUrl, ctx, lineHeight, infoMap.get('Website'));
    detailWriter(phone, ctx, lineHeight, infoMap.get('Phone'));
    detailWriter(location, ctx, lineHeight, infoMap.get('Location'));
    detailWriter(areaOfInterest, ctx, lineHeight, infoMap.get('AreaOfInterest'));
    // Save the output image as a PNG file
    const fs = require('fs');
    const stream = canvas.createPNGStream();
    const out = fs.createWriteStream(outputPath);
    stream.pipe(out);
    out.on('finish', () => console.log(`Output image with organization name saved as ${outputPath}`));

}


const aboutText = "As a Blockchain Engineer with a background in computer science, I excel at problem-solving and continuously learn new technologies and techniques.";
const firstName = 'Shubham';
const lastName = 'Gautam';
const designation = 'Blockchain Lead';
const company = 'Timechain Labs';
const overlay_file_name = '1666547947414.jpg';
const template_file = 'For Long Name.png';
const output_file_name = 'output_with_details.png';
const email = 'shubham@timechainlab.io';
const web_url = 'timechainlabs.io';
const phoneNo = '+91XXXXXXXX90';
const location = 'Chandigarh, India';
const areaOfInterest = 'Blockchain R&D';
const organization = 'Timechain Labs'

// let aboutText = "You are two steps away from delighting your visitors with a perfect visual experience. The following steps will help you get the most out of ImageKit.io’s image optimization and transformation capabilities.";
setDetails(firstName + ' ' + lastName, designation, aboutText, overlay_file_name, template_file, organization, output_file_name, email, web_url, phoneNo, location, areaOfInterest).then(r => console.log(r))

// setDetails(firstName+' '+lastName,designation,company,aboutText,overlay_file_name,template_file,company,output_file_name , email, web_url, phoneNo,location , areaOfInterest).then(r => console.log(r))
