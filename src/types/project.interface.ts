export interface ProjectProps {
     projectName: string;
     projectDesc: string;
     subCategory: string;
     cost: string;
     deliveryTime: string;
     status: ProjectStatus;
}

type ProjectStatus = "active" | "pause";
