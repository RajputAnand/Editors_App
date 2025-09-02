export default {
    control: {
      marginBottom: 15,
      fontSize: 16,
    fontWeight: 'normal',
    },
    "&placeholder":{
fontSize:"20px"
    },
    "&multiLine": {
      control: {
        fontFamily: "monospace",
        minHeight: 63,
      },
      highlighter: {
        padding: 10,
        // border: "2px solid transparent",
      },
      input: {
        
        padding: 10,
        border: "none",
        background:"#77768029",
        borderRadius:"5px"
      },
      "&placeholder":{
        

      },
      "&focused": {
        border: "none",
        outline:"none"
      },
      "&hover": {
        border: "none",
        outline:"none"
      }
      
    },
    "&singleLine": {
        display: "inline-block",
        width: 180,
    
        highlighter: {
          padding: 1,
          border: "2px inset transparent",
        },
        input: {
          padding: 1,
          border: "2px inset",
        },
      },
    
      suggestions: {
        list: {
          backgroundColor: "white",
          border: "1px solid rgba(0,0,0,0.15)",
          fontSize: 16,
        },
        item: {
          padding: "5px 15px",
          borderBottom: "1px solid rgba(0,0,0,0.15)",
          "&focused": {
            backgroundColor: "#cee4e5",
          },
        },
      },
    };
    