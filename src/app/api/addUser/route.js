import connectDB from "@/app/utils/db";
import User from "@/app/utils/userSchema";

export async function POST(req){
    console.log(req.body)
    try {
        const data = await req.json(); 
        console.log("Received data:", data); // Logging the data
        await connectDB();

        // Step 3: Check if the user already exists by their uid
        const existingUser = await User.findOne({ uid: data.uid });
    
        if (existingUser) {
          // If user already exists, return a response indicating so
          return new Response(
            JSON.stringify({ message: "User already exists", data: existingUser }),
            { status: 400 } // User already exists
          );
        }
    
        // Step 4: If user doesn't exist, create a new user document
        const newUser = new User({
          uid: data.uid,
          displayName: data.displayName,
          email: data.email,
          photoURL: data.photoURL,
        });
        await newUser.save();

    // Step 6: Return success response
    return new Response(
      JSON.stringify({ message: "User added successfully", data: newUser }),
      { status: 200 }
    );
        // You can now use the data (e.g., save it to the database)
        // For example, returning a success response
        return new Response(JSON.stringify({ message: 'User added successfully', data }), { status: 200 });
        
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}