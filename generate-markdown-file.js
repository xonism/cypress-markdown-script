import fs from 'fs'
import * as path from 'path'

const createMarkdownFileWithTestNames = (fileName, fileTitle) => {
  writeTitleToMarkdownFile(fileName, fileTitle)

  iterateThroughAllTestFiles(fileName)
}

const writeTitleToMarkdownFile = (markdownFileName, markdownFileTitle) => {
  fs.writeFile(markdownFileName, `# ${markdownFileTitle} | ${getDate()}\n\n`, assertError)
}

const getDate = () => new Date().toISOString().split('T')[0]

const assertError = (error) => {
  if (error) throw error
}

const iterateThroughAllTestFiles = (markdownFileName) => {
  const testFilePaths = getAllFiles('cypress/integration/').filter(filePath => filePath.includes('spec'))

  testFilePaths.forEach((testFilePath) => {
    const fileContent = fs.readFileSync(testFilePath, { encoding: 'utf8' })

    appendDescribeAndItValuesToMarkdownFile(fileContent, markdownFileName)
  })
}

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

const appendDescribeAndItValuesToMarkdownFile = (fileContent, markdownFileName) => {
  const fileLines = fileContent.split('\n')

  fileLines.forEach((line) => {
    if (doesLineContainDescribe(line)) {
      const lineText = getDescribeValueFromLine(line)
      
      appendDescribeValueToFile(markdownFileName, lineText)

      return
    } 

    if (!doesLineContainIt(line)) {
      return
    }
    
    const lineText = getItValueFromLine(line)
      
    line.includes('${') 
      ? appendItValueToFile(markdownFileName, `\`[DYNAMIC]\` ${lineText}`) 
      : appendItValueToFile(markdownFileName, lineText)
  })
}

const doesLineContainDescribe = (line) => /describe\(/.test(line)

const getDescribeValueFromLine = (line) => line.split('\'')[1]

const appendDescribeValueToFile = (markdownFileName, value) => {
  fs.appendFile(markdownFileName, `## ${value}\n\n`, assertError)
}

const doesLineContainIt = (line) => / it\(/.test(line)

const getItValueFromLine = (line) => line.replace(/`/g, '\'').split('\'')[1].replace(/\$/g, '').replace(/{/g, '[').replace(/}/g, ']')

const appendItValueToFile = (markdownFileName, value) => {
  fs.appendFile(markdownFileName, `${value}\n\n`, assertError)
}

createMarkdownFileWithTestNames('tests.md', 'Automatic E2E Tests')
