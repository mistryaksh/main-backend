export interface ProjectProps {
     projectDesc: string;
     subCategory: string;
     cost: string;
     deliveryTime: string;
     status: ProjectStatus;
}

type ProjectStatus = "active" | "pause";
