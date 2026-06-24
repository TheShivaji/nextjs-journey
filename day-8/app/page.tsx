import { createUser } from "./action/user.action";


export default function Home() {
  return (
   <form action={createUser}>
    <input type="text" placeholder="Name"  name="name"/>
    <input type="email" placeholder="Email" name="email"/>
    <input type="password" placeholder="Password" name="password"/>
    <button type="submit">Submit</button>
    
   </form>
  );
}
