const subsetFont = require("subset-font");
const glob = require("glob");
const path = require("path");
const fs = require("fs");
const inputDir = path.resolve(__dirname, "../../static/fonts");
const outputDir = path.resolve(__dirname, "../../static/fonts");
const cssOutputFile = path.resolve(
  __dirname,
  "../sources/assets/scss/_optimized-fonts.scss"
);

// Characters you want to keep in the font
const latinGlyphs =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžƒǺǻǼǽǾǿ";

const fontFaceTemplate = (fontName, fileName, fontFormat) => {
  return `@font-face {
  font-family: '${fontName}';
  src: url('../fonts/${fileName}.woff2') format('${fontFormat}');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;
};

const extractFontName = (fontName) => {
  const regex =
    /(^.*?)(-Italic|-Bold|-Regular|-Light|-Medium|-Black|-ExtraBold|-SemiBold|-Thin)?(\.[a-zA-Z0-9]+)?$/;
  const match = fontName.match(regex);
  return match && match[1] ? match[1] : fontName;
};

glob(path.join(inputDir, "*.{ttf,woff2}"), async (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  let cssContent = "";

  for (const file of files) {
    try {
      const fontData = fs.readFileSync(file);
      const fontFormat = path.extname(file).substring(1); // Remove the leading dot
      const fileName = path.basename(file, path.extname(file));
      const fontName = extractFontName(fileName);
      const subsetName = "compressed";

      // Subset the font
      const subsettedFont = await subsetFont(fontData, latinGlyphs, {
        inputFormat: fontFormat,
        targetFormat: "woff2",
        glyphs: latinGlyphs,
        preserveNameIds:[256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350]

      });

      fs.writeFileSync(
        path.join(outputDir, `${fileName}-${subsetName}.woff2`),
        subsettedFont
      );
      console.log(
        `Optimized font file '${file}' and saved as '${fileName}-${subsetName}.woff2' in '${outputDir}'`
      );

      // Remove the original font file
      fs.unlinkSync(file);
      console.log(`Removed the original font file '${file}'`);

      cssContent += fontFaceTemplate(
        fontName,
        `${fileName}-${subsetName}`,
        "woff2" // Set the font format in the CSS to WOFF2
      );
    } catch (error) {
      console.error(`Error processing file '${file}':`, error);
    }
  }

  fs.writeFileSync(cssOutputFile, cssContent);
  console.log(`@font-face statements saved in '${cssOutputFile}'`);
});