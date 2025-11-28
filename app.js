document.getElementById("btn").addEventListener("click", async()=>{
 const file=document.getElementById("videoInput").files[0];
 if(!file)return alert("Select a video!");
 const fd=new FormData(); fd.append("video",file);
 document.getElementById("status").innerText="Converting...";
 const res=await fetch("http://localhost:5000/convert",{method:"POST",body:fd});
 const blob=await res.blob();
 const url=URL.createObjectURL(blob);
 const audio=document.getElementById("audioResult");
 audio.src=url; audio.style.display="block";
 document.getElementById("status").innerText="Done!";
});
