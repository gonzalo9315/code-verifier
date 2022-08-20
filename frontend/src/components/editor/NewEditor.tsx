import React, { Fragment, useState } from 'react'
import Editor from 'react-simple-code-editor'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'

const styles: any = {
    root: {
        boxSizing: 'border-box',
        fontFamily: '"Dank Mono", "Fira Code", monospace',
        ...theme.plain
    }
}

const languages: Language[] = [
    "tsx",
    "typescript",
    "javascript",
    "jsx",
    "python",
    "json",
    "go"
]

const HighLightElement = (code: string) => (
    <Highlight {...defaultProps} theme={theme} code={code} language={languages[0]}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Fragment>
                {tokens.map((line, i) => (
                    <div {...getLineProps({ line: line, key: i })}>
                        {line.map((token, key) =>
                            <span {...getTokenProps({ token, key })} />
                        )}
                    </div>
                ))}
            </Fragment>
        )}
    </Highlight>
)


export const NewEditor = (props?: any) => {
    
    const [code, setCode] = useState(props.codeSolution)
    const [languageSelected, setLanguageSelected] = useState(languages[0])
    
    const handleLanguageChange = (newValue: any) => {
        setLanguageSelected(newValue)
    }

    const handleCodeChange = (newCode: string) => {
        setCode(newCode)
    }

    return (
        <>
            <div>
                <div style={{display:'flex', justifyContent: 'right', alignItems: 'center', marginTop: '15px', height: '22px'}}>
                    <p style={{marginRight: '5px'}}>Language:</p>
                    <select style={{height: 'fit-content'}}>
                        {languages.map((language, index) => (
                            <option onChange={(value) => handleLanguageChange(value)} value={language} key={index}>{language}</option>
                        ))}
                    </select>                
                </div>
                <Editor
                    value={code}
                    onValueChange={(value) => {
                      handleCodeChange(value)
                      if(props.func) props.func(value)
                    } }
                    highlight={HighLightElement}
                    padding={10}
                    style={styles.root}
                    placeholder='Write the solution code'
                />
            </div>
        </>

    )
}