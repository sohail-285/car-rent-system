import mongoose from "mongoose";
import Car from "../models/Car.js";

mongoose.connect("mongodb://127.0.0.1:27017/car_rent");

const carsData = [
  {
    carName: "Hyundai Creta",
    carModel: "2024",
    carType: "SUV",
    pricePerDay: 1500,
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.Z749P4HrtmCJZbmFDypYswHaEK?pid=Api&P=0&h=180",
    color: "Silver",
    description: "Compact SUV with great fuel efficiency",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 5,
    availability: true
  },
  {
    carName: "Maruti Swift",
    carModel: "2024",
    carType: "Hatchback",
    pricePerDay: 1000,
    imageUrl: "https://tse4.mm.bing.net/th/id/OIP.Z_qRV2YxCgOiD05mSwYmrwHaEK?pid=Api&P=0&h=180",
    color: "Red",
    description: "Affordable and reliable compact car",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 5,
    availability: true
  },
  {
    carName: "BMW X5",
    carModel: "2024",
    carType: "Luxury",
    pricePerDay: 5000,
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.F1fTJ1ePnpUz6tgsxSxe0wHaEK?pid=Api&P=0&h=180",
    color: "Black",
    description: "Luxury SUV with premium features",
    fuelType: "Diesel",
    transmission: "Automatic",
    seatingCapacity: 5,
    availability: true
  },
  {
    carName: "Tata Nexon",
    carModel: "2024",
    carType: "SUV",
    pricePerDay: 1200,
    imageUrl: "https://tse1.mm.bing.net/th/id/OIP.AidPYdHlVBg7jzhT-KEblgHaEK?pid=Api&P=0&h=180",
    color: "Blue",
    description: "Stylish and spacious SUV",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 5,
    availability: true
  },
  {
    carName: "Mahindra XUV700",
    carModel: "2024",
    carType: "SUV",
    pricePerDay: 2500,
    imageUrl: "https://tse2.mm.bing.net/th/id/OIP.cMqfC2IdnnK74t9gxrGlQAHaFj?pid=Api&P=0&h=180",
    color: "White",
    description: "Premium SUV with advanced features",
    fuelType: "Diesel",
    transmission: "Automatic",
    seatingCapacity: 7,
    availability: true
  },
  {
    carName: "Toyota Fortuner",
    carModel: "2024",
    carType: "SUV",
    pricePerDay: 3000,
    imageUrl: "https://tse4.mm.bing.net/th/id/OIP.i12RkHC9eWqut6XgiwXpGwHaFX?pid=Api&P=0&h=180",
    color: "Gray",
    description: "Powerful and rugged SUV",
    fuelType: "Diesel",
    transmission: "Automatic",
    seatingCapacity: 7,
    availability: true
  },
  {
    carName: "Honda City",
    carModel: "2024",
    carType: "Sedan",
    pricePerDay: 1300,
    imageUrl: "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-76.jpeg",
    color: "Silver",
    description: "Sedan with comfortable interior",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 5,
    availability: true
  },
  {
    carName: "Skoda Slavia",
    carModel: "2024",
    carType: "Sedan",
    pricePerDay: 1800,
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.x_CK6bE_of-sYVBA_R1f-QHaE8?pid=Api&P=0&h=180",
    color: "Pearl White",
    description: "European sedan with modern design",
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 5,
    availability: true
  },
  {
    carName: "Kia Sonet",
    carModel: "2024",
    carType: "SUV",
    pricePerDay: 1400,
    imageUrl: "https://tse2.mm.bing.net/th/id/OIP.5wknmBx2JS6EuYfjLCDqygHaEK?pid=Api&P=0&h=180",
    color: "Orange",
    description: "Compact SUV with tech features",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 5,
    availability: true
  },
  {
    carName: "Mercedes-Benz C-Class",
    carModel: "2024",
    carType: "Luxury",
    pricePerDay: 4500,
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.MynEQfYeH49Vx5tn0i6RVwHaE8?pid=Api&P=0&h=180",
    color: "Black",
    description: "Luxury sedan with premium comfort",
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 5,
    availability: true
  }
];

async function seedCars() {
  try {
    await Car.deleteMany({});
    console.log("🗑️  Cleared existing cars");

    const result = await Car.insertMany(carsData);
    console.log(`✅ Successfully seeded ${result.length} cars!`);

    const allCars = await Car.find();
    console.log("\n📋 Cars in database:");
    allCars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.carName} (${car.carModel}) - ₹${car.pricePerDay}/day`);
    });

    mongoose.connection.close();
    console.log("\n✅ Database seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    mongoose.connection.close();
  }
}

seedCars();