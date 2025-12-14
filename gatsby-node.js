const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);

// ADD THIS SECTION - GraphQL schema customization
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
    type MarkdownRemarkFrontmatterResearchers {
      name: String
      title: String
      profileUrl: String
    }
    
    type MarkdownRemarkFrontmatter implements Node {
      researchers: [MarkdownRemarkFrontmatterResearchers]
    }
  `

  createTypes(typeDefs)
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const blogList = path.resolve(`./src/templates/blog-list.js`);

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
        edges {
          node {
            id
            frontmatter {
              slug
              template
              title
            }
          }
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create markdown pages
  const posts = result.data.allMarkdownRemark.edges;
  let blogPostsCount = 0;

  posts.forEach((post, index) => {
    const id = post.node.id;
    const { slug, template } = post.node.frontmatter;
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    if (!slug || !template) {
      reporter.warn(`Missing slug or template for node: ${id}`);
      return;
    }

    // Map `publication` to `publication-page.js`
    const componentPath = template === "publication" 
      ? path.resolve(`src/templates/publication-page.js`) 
      : path.resolve(`src/templates/${template}.js`);

    createPage({
      path: slug,
      component: componentPath,
      // Additional data can be passed via context
      context: {
        id,
        previous,
        next,
      },
    });

    // Count blog posts.
    if (template === "blog-post") {
      blogPostsCount++;
    }
  });

  // Create blog-list pages
  const postsPerPage = 9;
  const numPages = Math.ceil(blogPostsCount / postsPerPage);

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: blogList,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};
