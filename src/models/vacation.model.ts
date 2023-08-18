export interface IVacation {
  id: number;
  destination: string;
  price: number;
  imgUrl: string;
  description: string;
  startingDate: Date;
  endingDate: Date;
  followers: number[];
}

export interface IVacationFollowersReport {
  id?: string;
  destination: number;
  vacationId: number;
  count: string;
}
