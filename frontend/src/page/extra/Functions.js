/**
 * wrap JSX.Element with page context
 * @param {string} name 
 * @param {string} url 
 * @param {JSX.Element} jsx 
 */
export const createPageContext = (name, url, jsx) => {
    return {
        name: name,
        url: url,
        jsx: jsx
    }
}