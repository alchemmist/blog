module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["html", "css", "js"]);

  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
