import React, {useState} from 'react';
import '../../styles/Activities.css';
const Activities = () => {
    const [activities] = useState([
        {
            sport: "Mountain Bike Ride",
            date: "Sat, 4/20/2024",
            title: "Afternoon Mountain Bike Ride",
            time: "1:22:30",
            distance: "14.91 km",
        },
        {
            sport: "Mountain Bike Ride",
            date: "Sat, 7/15/2023",
            title: "Szybka oliva",
            time: "1:05:14",
            distance: "10.81 km",
        },
        {
            sport: "Ride",
            date: "Sat, 4/29/2023",
            title: "Afternoon Ride",
            time: "2:06:47",
            distance: "29.94 km",
        },
        {
            sport: "Ride",
            date: "Thu, 4/27/2023",
            title: "Luźny trip",
            time: "42:59",
            distance: "14.13 km",
        },
    ]);


    return (
        <div className="container">
            <h1>My Activities</h1>
            <div className="search-bar">
                <label><input type="checkbox" id="commute" /> Commute</label>
                <label><input type="checkbox" id="private" /> Private</label>
            </div>
            <div className="activities">
                <h2>{activities.length} Activities</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Sport</th>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Time</th>
                        <th>Distance</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {activities.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.sport}</td>
                            <td>{activity.date}</td>
                            <td>{activity.title}</td>
                            <td>{activity.time}</td>
                            <td>{activity.distance}</td>
                            <td className="actions">
                                <a href="#">Edit</a>
                                <a href="#">Delete</a>
                                <a href="#">Share</a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Activities;