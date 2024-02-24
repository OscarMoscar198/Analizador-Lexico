import { useState } from "react";
import Monaco from "@monaco-editor/react";
import "./styles.css"; // Importa tu archivo CSS aquí

function Home() {
  const [codigo, setCodigo] = useState("");
  const [resul, setResul] = useState([]);
  const [esValido, setEsValido] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  function handleValidarClick() {
    analizarCodigo();
  }

  const analizarCodigo = () => {
    const lexer = new Lexer(codigo);
    let tokens = [];
    let error = null;

    try {
      let token = lexer.getNextToken();
      while (token.type !== 'FINAL') {
        tokens.push(token);
        token = lexer.getNextToken();
      }
      setEsValido(true);
    } catch (err) {
      setEsValido(false);
      error = `Error en la posición ${lexer.position}: ${err.message}`;
    }

    setResul(tokens.map((token) => `${token.type}: ${token.value}`));
    setErrorMessage(error);  
  };

  function setEditorTheme(monaco) {
    monaco.editor.defineTheme("automatum", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#286492",
        "editor.lineHighlightBackground": "#FFFFFF0F",
      },
    });
  }

  return (
    <>
      <div className="title">
        <h1>AUTOMATUM</h1>
        <h2>OSCAR JAVIER CASTAÑEDA SOLIS - 213447</h2>
        <h2>AXEL GIOVANNI REYES RAMOS - 213370</h2>
      </div>
      <div className="area">
        <Monaco
          beforeMount={setEditorTheme}
          width="800"
          height="50vh"
          language="javascript"
          theme="automatum"
          value={codigo}
          options={{
            selectOnLineNumbers: false,
            mouseStyle: "text",
            acceptSuggestionOnEnter: "off",
            quickSuggestions: false,
          }}
          onChange={(newValue) => setCodigo(newValue)}
        />
        <div className="line-validator">
          <button onClick={handleValidarClick}>Validar</button>
          {esValido !== null && (
            <p>
              {esValido ? ' ES VALIDO' : ' NO ES VALIDO'}
              {esValido === false && errorMessage && ( 
                <span className="error-message">
                  {errorMessage}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="result-list">
        <table>
          <thead>
            <tr>
                <th>Tipo</th>
                <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {resul.map((info, index) => (
                <tr key={index}>
                    {/* Suponiendo que `info` es una cadena en el formato "tipo: valor" */}
                    <td>{info.split(":")[0]}</td>
                    <td>{info.split(":")[1]}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.tokenTable = [
      { regex: /funcc/, type: 'FUNCION' },
      { regex: /for/, type: 'FOR' },
      { regex: /if/, type: 'IF' },
      { regex: /int|string|float|bool/, type: 'TIPO_DATO' },
      { regex: /return/, type: 'RETURN' },
      { regex: /else/, type: 'ELSE' },
      { regex: /contenido/, type: 'CONTENIDO' },
      { regex: /(<=|>=|!=|==|<|>)/, type: 'OPERADORES' },
      { regex: /\(/, type: 'PARENTESIS_ABRIR' },
      { regex: /\)/, type: 'PARENTESIS_CERRAR' },
      { regex: /\{/, type: 'CORCHETE_ABRIR' },
      { regex: /\}/, type: 'CORCHETE_CERRAR' },
      { regex: /"/, type: 'COMILLAS' },
      { regex: /=/, type: 'ASIGNACION' },
      { regex: /;/, type: 'PUNTO_COMA' },
      { regex: /\++/, type: 'INCREMENTO' },
      { regex: /\--/, type: 'DECREMENTO' },
      { regex: /,/, type: 'COMA' }, 
      { regex: /[0-9]+/, type: 'DIGITOS' },
      { regex: /[a-zA-Z]+/, type: 'NOMBRES' }
    ];
  }

  getNextToken() {
    while (this.position < this.input.length) {
      let char = this.input[this.position];
      for (const tokenDef of this.tokenTable) {
        const match = this.input.slice(this.position).match(tokenDef.regex);
        if (match && match.index === 0) {
          this.position += match[0].length;
          return { type: tokenDef.type, value: match[0] };
        }
      }
      if (/\s/.test(char)) {
        this.position++;
        continue;
      }
      throw new Error(`Caracter no identificado: ${char}`);
    }
    return { type: 'FINAL', value: null };
  }
}

export default Home;