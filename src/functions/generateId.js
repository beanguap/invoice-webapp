function generateID() {
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var id = "";

  // Generate 2 random uppercase letters
  for (var i = 0; i < 2; i++) {
      id += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate 4 random digits
  for (var j = 0; j < 4; j++) {
      id += Math.floor(Math.random() * 10);
  }

  return id; // Return the generated ID
}

export default generateID;
