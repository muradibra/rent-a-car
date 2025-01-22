import { Request, Response } from "express";
import Review from "../mongoose/schemas/review";
import Reservation from "../mongoose/schemas/reservation";
import { ReservationStatus } from "../types/reservation";
import Rent from "../mongoose/schemas/rent";
import { ReviewStatus } from "../types/review";

const getAll = async (_: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .populate("rent")
      .populate("author", "name username email avatar");

    res.status(200).json({
      items: reviews,
      message: "Reviews fetched successfully! ",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const getByRentId = async (req: Request, res: Response) => {
  try {
    const { rentId } = req.params;

    const reviews = await Review.find({
      rent: rentId,
      status: ReviewStatus.Approved,
    })
      .populate("author", "name username email avatar")
      .populate("rent");

    res.status(200).json({
      items: reviews,
      message: "Reviews fetched successfully! ",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { content, rate, reservationId } = req.matchedData;

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      res.status(404).json({ message: "Reservation not found!" });
      return;
    }

    if (reservation.dropOffDate > new Date()) {
      res
        .status(400)
        .json({ message: "You can not leave a review after drop off date" });
      return;
    }

    if (reservation.status !== ReservationStatus.Approved) {
      res.status(400).json({
        message: "You can only review after the reservation is approved",
      });
      return;
    }

    if (reservation.customer.toString() !== user!._id.toString()) {
      res.status(400).json({
        message: "You can only review your own reservation",
      });
      return;
    }

    if (reservation.hasReview) {
      res.status(400).json({
        message: "You already reviewed this reservation",
      });
      return;
    }

    reservation.hasReview = true;
    await reservation.save();

    const review = await Review.create({
      author: user!._id,
      content,
      rate,
      rent: reservation.rent,
    });

    await Rent.findByIdAndUpdate(reservation.rent, {
      $push: { reviews: review._id },
    });

    res.status(200).json({
      item: review,
      message: "Review created successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const changeStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.matchedData;

  const review = await Review.findById(id);

  if (!review) {
    res.status(404).json({ message: "Review not found!" });
    return;
  }

  review.status = status;
  await review.save();

  res.status(200).json({
    item: review,
    message: "Review status changed successfully!",
  });
};

const reviewController = {
  getAll,
  getByRentId,
  create,
  changeStatus,
};

export default reviewController;
