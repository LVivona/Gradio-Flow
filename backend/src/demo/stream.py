import streamlit as st

def add_port(type='p2p', mode='input', key="bitconnect", additional_info={}):
    return {
        'type' : type,
        'mode' : mode,
        'key' : key,
        'additional': additional_info
    }

if __name__ == "__main__":
    st.title("Test Add Handel")
    with open('./stream.py') as f:
        st.code(f.read(), "python")
    with st.expander("Add_Port"):
        type = st.multiselect("type", ["p2p", 'https', 'local'])
        mode = st.selectbox("mode", ("input", "output"))
        key = st.text_input("Key", "")
        btn_click = st.button("package")
        
        if btn_click:
            st.json(add_port(type, mode, key))