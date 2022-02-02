import React, { useState, useEffect } from "react";
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

const App = () => {

    const [input, setInput] = useState('')
    const [code, setCode] = useState('')

    const submitHandler = async () => {
        try {
            const res = await esbuild.build({
                entryPoints: ['index.js'],
                bundle: true,
                write: false,
                plugins: [unpkgPathPlugin(input)]
            });

            setCode(res.outputFiles[0].text);
        } catch (err) {
            console.error(err);
        }
    }

    const startService = async () => {
        try {
            await esbuild.initialize({
                worker: true,
                wasmURL: '/esbuild.wasm'
            });
        } catch (err) {
        }
    }

    useEffect(() => {
        startService()

    }, [])

    return (
        <div>
            <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
            <div>
                <button onClick={submitHandler}>Submit</button>
            </div>
            <pre>{code}</pre>
        </div>
    )
}

export default App