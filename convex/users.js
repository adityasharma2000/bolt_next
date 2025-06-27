import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const { name, email, picture, uid } = args;
    // const user = await ctx.get("users").get(uid);
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    console.log("CUser", user);
    if (user?.length == 0) {
      console.log("User not found, creating new user");
      const result = await ctx.db.insert("users", {
        name,
        email,
        picture,
        uid,
      });
      console.log("User created", result);
    }
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { email } = args;
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .collect();
    console.log("User", user);
    return user[0];
  },
});
